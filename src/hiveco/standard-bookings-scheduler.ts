class StandardBookingsScheduler {
  constructor(
    private readonly emailService: EmailService,
    private readonly roomRepository: RoomRepository,
    private readonly memberRepository: MemberRepository,
    private readonly bookingRequestRepository: BookingRequestRepository
  ) {}

  processBookings() {
    const standardBookingRequests = this.bookingRequestRepository.getStandardBookings()
    for (let bookingRequest of standardBookingRequests) {
      const member = this.memberRepository.getById(bookingRequest.memberId)
      const room = this.roomRepository.getById(bookingRequest.roomId)

      if (StandardBookingsScheduler.isRoomAvailable(room, bookingRequest)) {
        room.bookings.push({
          memberId: member.id,
          startTime: bookingRequest.startTime,
          endTime: bookingRequest.endTime,
        })

        this.roomRepository.save(room)
        this.emailService.sendRoomBookingConfirmationTo(member, room)
      } else {
        this.emailService.sendUnableToProcessBooking(member, room)
      }
    }
  }

  private static isRoomAvailable(room: Room, bookingRequest: BookingRequest) {
    for (let booking of room.bookings) {
      if (
        booking.startTime >= bookingRequest.startTime ||
        bookingRequest.endTime >= booking.startTime
      ) {
        return false
      }
    }

    return true
  }
}
