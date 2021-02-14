export class PriorityBookingsScheduler {
  constructor(
    private readonly emailService: EmailService,
    private readonly roomRepository: RoomRepository,
    private readonly memberRepository: MemberRepository,
    private readonly bookingRequestRepository: BookingRequestRepository,
    private readonly clock: Clock
  ) {}

  processBookings() {
    const priorityBookingRequests = this.bookingRequestRepository.getPriorityBookingRequests()
    for (let bookingRequest of priorityBookingRequests) {
      const member = this.memberRepository.getById(bookingRequest.memberId)
      const room = this.roomRepository.getById(bookingRequest.roomId)

      const currentMonth = this.clock.now().getMonth() + 1

      if (
        !member.isDisabledByAdmin &&
        member.invoices.find((x) => x.month === currentMonth)?.paymentReceived
      ) {
        if (PriorityBookingsScheduler.isRoomAvailable(room, bookingRequest)) {
          room.bookings.push({
            memberId: member.id,
            startTime: bookingRequest.startTime,
            endTime: bookingRequest.endTime,
          })

          this.roomRepository.save(room)
          this.emailService.sendRoomBookingConfirmationTo(member, room)
        } else {
          const roomsInLocation = this.roomRepository.getRoomsByLocationId(room.locationId)
          for (let room of roomsInLocation) {
            if (PriorityBookingsScheduler.isRoomAvailable(room, bookingRequest)) {
              room.isOfferedAsAlternativeBooking = true
              room.offeredAsAlternativeBookingTo = member

              this.roomRepository.save(room)
              this.emailService.sendAlternativeRoomOfferTo(member, room)
              return
            }
          }
          this.emailService.sendUnableToProcessBooking(member, room)
        }
      } else {
        this.bookingRequestRepository.addToStandardBookings(bookingRequest)
        this.emailService.sendUnableToProcessPriorityBookingDueToPaymentNotReceived(member, room)
      }
    }
  }

  private static isRoomAvailable(room: Room, bookingRequest: BookingRequest) {
    for (let booking of room.bookings) {
      if (
        (booking.startTime >= bookingRequest.startTime ||
          bookingRequest.endTime >= booking.startTime) &&
        !room.isOfferedAsAlternativeBooking
      ) {
        return false
      }
    }

    return true
  }
}
