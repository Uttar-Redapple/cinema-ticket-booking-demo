interface Cinema {
    id: string;
    seats: string[];
    purchasedSeats: Set<string>;
  }
  
  export default class Booking{
    cinemas: Record<string, Cinema> = {};
    constructor(){}
    createCinema(seatCount: number): Cinema {
        const seats = Array.from({ length: seatCount }, (_, i) => String(i + 1));
        const id = Math.random().toString(36).substr(2, 9);
        const purchasedSeats = new Set<string>();
      
        const cinema: Cinema = { id, seats, purchasedSeats };
        this.cinemas[id] = cinema;
      
        return cinema;
      }
      
    purchaseSeat(cinemaId: string, seatNumber: string): string | null {
        const cinema = this.cinemas[cinemaId];
      
        if (!cinema) {
          return null; // Cinema with the provided ID does not exist
        }
      
        if (cinema.purchasedSeats.has(seatNumber)) {
          return 'Seat already purchased'; // Seat is already purchased
        }
      
        const index = cinema.seats.indexOf(seatNumber);
        if (index === -1) {
          return null; // Seat with the provided number does not exist in the cinema
        }
      
        cinema.seats.splice(index, 1);
        cinema.purchasedSeats.add(seatNumber);
      
        return seatNumber;
      }
      
    purchaseTwoConsecutiveSeats(cinemaId: string): string[] | null {
        const cinema = this.cinemas[cinemaId];
      
        if (!cinema) {
          return null; // Cinema with the provided ID does not exist
        }
      
        const seats = cinema.seats;
      
        for (let i = 0; i < seats.length - 1; i++) {
          if (parseInt(seats[i]) + 1 === parseInt(seats[i + 1])) {
            const seat1 = seats[i];
            const seat2 = seats[i + 1];
      
            cinema.seats.splice(i, 2);
            cinema.purchasedSeats.add(seat1);
            cinema.purchasedSeats.add(seat2);
      
            return [seat1, seat2];
          }
        }
      
        return null; // No consecutive seats available
      }
  }
  
