import { Carriage, ReservationRequest, Seats, Train } from '../../src/goos/train'

describe('train', () => {
  it('can fulfill reservation requests when seat availability is below the reserved barrier of 70%', () => {
    const carriages: Carriage[] = [new Carriage(new Seats(10, 0))]
    const train = new Train(carriages)

    const reservationRequest1 = new ReservationRequest(1)
    const reservationRequest2 = new ReservationRequest(1)
    const reservationRequest3 = new ReservationRequest(1)
    const reservationRequest4 = new ReservationRequest(1)
    const reservationRequest5 = new ReservationRequest(1)
    const reservationRequest6 = new ReservationRequest(1)
    const reservationRequest7 = new ReservationRequest(1)
    const reservationRequest8 = new ReservationRequest(1)

    train.reserveSeats(reservationRequest1)
    train.reserveSeats(reservationRequest2)
    train.reserveSeats(reservationRequest3)
    train.reserveSeats(reservationRequest4)
    train.reserveSeats(reservationRequest5)
    train.reserveSeats(reservationRequest6)
    train.reserveSeats(reservationRequest7)
    train.reserveSeats(reservationRequest8)

    expect(reservationRequest1.seatsFound()).toBeTruthy()
    expect(reservationRequest2.seatsFound()).toBeTruthy()
    expect(reservationRequest3.seatsFound()).toBeTruthy()
    expect(reservationRequest4.seatsFound()).toBeTruthy()
    expect(reservationRequest5.seatsFound()).toBeTruthy()
    expect(reservationRequest6.seatsFound()).toBeTruthy()
    expect(reservationRequest7.seatsFound()).toBeTruthy()
  })

  it('can not fulfill reservation requests when seat availability is above the reserved barrier of 70%', () => {
    const carriages: Carriage[] = [new Carriage(new Seats(10, 0))]
    const train = new Train(carriages)

    const reservationRequest1 = new ReservationRequest(1)
    const reservationRequest2 = new ReservationRequest(1)
    const reservationRequest3 = new ReservationRequest(1)
    const reservationRequest4 = new ReservationRequest(1)
    const reservationRequest5 = new ReservationRequest(1)
    const reservationRequest6 = new ReservationRequest(1)
    const reservationRequest7 = new ReservationRequest(1)
    const reservationRequest8 = new ReservationRequest(1)

    train.reserveSeats(reservationRequest1)
    train.reserveSeats(reservationRequest2)
    train.reserveSeats(reservationRequest3)
    train.reserveSeats(reservationRequest4)
    train.reserveSeats(reservationRequest5)
    train.reserveSeats(reservationRequest6)
    train.reserveSeats(reservationRequest7)
    train.reserveSeats(reservationRequest8)

    expect(reservationRequest8.seatsFound()).toBeFalsy()
  })
})
