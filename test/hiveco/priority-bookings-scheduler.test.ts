import equal from 'fast-deep-equal'
import { Mock, It, Times } from 'moq.ts'
import { PriorityBookingsScheduler } from '../../src/hiveco/priority-bookings-scheduler'

describe('priority bookings scheduler', () => {
  describe('successfully booking a requested room', () => {
    const stubbedMemberRepository = new Mock<MemberRepository>()
    const stubbedBookingRequestRepository = new Mock<BookingRequestRepository>()
    const stubbedClock = new Mock<Clock>()

    const memberId = 666
    const roomId = 101

    const bookingRequest = {
      memberId: memberId,
      roomId: roomId,
      startTime: new Date(2021, 2, 1, 9, 30),
      endTime: new Date(2021, 2, 1, 10, 30),
    }

    const member = {
      id: memberId,
      invoices: [
        {
          amount: 10,
          month: 2,
          paymentReceived: true,
        },
      ],
      isDisabledByAdmin: false,
      name: 'John Doe',
      email: 'johndoe@email.com',
    }

    stubbedBookingRequestRepository
      .setup((instance) => instance.getPriorityBookingRequests())
      .returns([bookingRequest])

    stubbedMemberRepository
      .setup((instance) => instance.getById(It.Is<number>((n) => n === memberId)))
      .returns(member)

    stubbedClock.setup((instance) => instance.now()).returns(new Date(2021, 1, 1))

    it('processes priority bookings when the requested room is available', () => {
      const dummyEmailService = new Mock<EmailService>()
      const mockRoomRepository = new Mock<RoomRepository>()

      const room = {
        id: roomId,
        locationId: 1,
        bookings: [],
        isOfferedAsAlternativeBooking: false,
        offeredAsAlternativeBookingTo: undefined,
      }

      const expectedRoom: Room = {
        id: roomId,
        locationId: 1,
        bookings: [
          {
            memberId: memberId,
            startTime: bookingRequest.startTime,
            endTime: bookingRequest.endTime,
          },
        ],
        isOfferedAsAlternativeBooking: false,
        offeredAsAlternativeBookingTo: undefined,
      }

      dummyEmailService
        .setup((instance) =>
          instance.sendRoomBookingConfirmationTo(It.IsAny<Member>(), It.IsAny<Room>())
        )
        .returns()

      mockRoomRepository
        .setup((instance) => instance.getById(It.Is<number>((n) => n === roomId)))
        .returns(room)
        .setup((instance) => instance.save(It.IsAny()))
        .returns()

      const sut = new PriorityBookingsScheduler(
        dummyEmailService.object(),
        mockRoomRepository.object(),
        stubbedMemberRepository.object(),
        stubbedBookingRequestRepository.object(),
        stubbedClock.object()
      )

      sut.processBookings()

      mockRoomRepository.verify(
        (instance) =>
          instance.save(
            It.Is<Room>((room) => equal(room, expectedRoom))
          ),
        Times.Once()
      )
    })

    it('sends a room booking confirmation email when the requested room has been booked', () => {
      const mockEmailService = new Mock<EmailService>()
      const stubbedRoomRepository = new Mock<RoomRepository>()

      const room = {
        id: roomId,
        locationId: 1,
        bookings: [],
        isOfferedAsAlternativeBooking: false,
        offeredAsAlternativeBookingTo: undefined,
      }

      mockEmailService
        .setup((instance) =>
          instance.sendRoomBookingConfirmationTo(It.IsAny<Member>(), It.IsAny<Room>())
        )
        .returns()

      stubbedRoomRepository
        .setup((instance) => instance.getById(It.Is<number>((n) => n === roomId)))
        .returns(room)
        .setup((instance) => instance.save(It.IsAny()))
        .returns()

      const sut = new PriorityBookingsScheduler(
        mockEmailService.object(),
        stubbedRoomRepository.object(),
        stubbedMemberRepository.object(),
        stubbedBookingRequestRepository.object(),
        stubbedClock.object()
      )

      sut.processBookings()

      mockEmailService.verify(
        (instance) =>
          instance.sendRoomBookingConfirmationTo(
            It.Is<Member>((m) => equal(m, member)),
            It.Is<Room>((r) => equal(r, room))
          ),
        Times.Once()
      )
    })
  })

  describe('offering an alternative time for a priority booking', () => {
    it('offers an alternative room in the same location when one is available at for the same requested times', () => {})
    it('sends an email notifying the member of the alternative room being offered', () => {})
  })

  describe('unsuccessfully booking a requested room', () => {
    it('sends an email notifying the member their priority booking was not processed when their requested room and all alternatives are unavailable', () => {})
    it('downgrades a priority booking to a standard booking when the member has not paid their subscription', () => {})
    it('sends an email notifying the member their priority booking was not processed when they have not paid their subscription', () => {})
  })
})
