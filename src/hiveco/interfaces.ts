class Room {
  id: number
  locationId: number
  bookings: Booking[]
  isOfferedAsAlternativeBooking: Boolean
  offeredAsAlternativeBookingTo: Member
}

interface Clock {
  now(): Date
}

interface Booking {
  memberId: number
  startTime: Date
  endTime: Date
}

interface Invoice {
  paymentReceived: Boolean
  amount: number
  month: number
}

interface Member {
  id: number
  invoices: Invoice[]
  isDisabledByAdmin: boolean
  name: string
  email: string
}

interface BookingRequest {
  memberId: number
  roomId: number
  startTime: Date
  endTime: Date
}

interface EmailService {
  sendAlternativeRoomOfferTo(member: Member, room: Room): void
  sendUnableToProcessBooking(member: Member, room: Room): void
  sendRoomBookingConfirmationTo(member: Member, room: Room): void
  sendStandardBookingConfirmedTo(member: Member, room: Room): void
  sendUnableToProcessPriorityBookingDueToPaymentNotReceived(member: Member, room: Room): void
}

interface RoomRepository {
  getById(id: number): Room
  getRoomsByLocationId(locationId: number): Room[]
  save(room: Room): void
}

interface BookingRequestRepository {
  getPriorityBookingRequests(): BookingRequest[]
  getStandardBookings(): BookingRequest[]
  addToStandardBookings(bookingRequest): void
}

interface MemberRepository {
  getById(id: number): Member
}
