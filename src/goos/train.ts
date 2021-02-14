export class Seats {
    constructor(
        private readonly total: number,
        private reserved: number
    ) {}

    getPercentageReserved(): number {
        return (this.reserved / this.total) * 100
    }

    reserveSeats(seatsRequired: number) {
       this.reserved += seatsRequired
    }
}

export class Carriage {
    constructor(private readonly seats: Seats) {}

    getSeats(): Seats {
        return this.seats
    }

    reserveSeats(seatsRequired: number) {
        this.seats.reserveSeats(seatsRequired)
    }
}

export class ReservationRequest {
    private requestedSeatsFound: boolean = false

    constructor(
        private readonly seatsRequired: number,
    ) {}

    reserveSeatsIn(carriage: Carriage): void {
        carriage.reserveSeats(this.seatsRequired)
        this.requestedSeatsFound = true
    }

    cannotFindSeats(): void {
        this.requestedSeatsFound = false
    }

    seatsFound(): boolean {
        return this.requestedSeatsFound
    }
}

export class Train {
    constructor(
        private readonly carriages: Carriage[]
    ) {}

    private readonly percentReservedBarrier: number  = 70

    public reserveSeats(request: ReservationRequest)  {
        for(let carriage of this.carriages) {
            if(carriage.getSeats().getPercentageReserved() < this.percentReservedBarrier) {
                request.reserveSeatsIn(carriage)
                return
            }
        }
        request.cannotFindSeats()
    }
}
