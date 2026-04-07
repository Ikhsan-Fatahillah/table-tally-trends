export type SeatType = "Counter" | "Table" | "Private Room";
export type ReservationStatus = "confirmed" | "cancelled";

export interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  guests: number;
  seatType: SeatType;
  status: ReservationStatus;
  bookedAt: string; // ISO datetime
  cancelledAt?: string; // ISO datetime
}

const names = [
  "Andi Pratama", "Budi Santoso", "Citra Dewi", "Dian Putri", "Eko Saputra",
  "Fitri Ayu", "Gilang Ramadhan", "Hana Salsabila", "Irfan Hakim", "Joko Widodo",
  "Kartika Sari", "Luthfi Rahman", "Maya Anggraini", "Nadia Febrina", "Oscar Lawalata",
  "Putri Handayani", "Qori Sandria", "Rina Marlina", "Surya Darma", "Tania Wijaya",
];

const seatTypes: SeatType[] = ["Counter", "Table", "Private Room"];
const seatConfig = {
  Counter: { total: 8, maxGuests: 2 },
  Table: { total: 12, maxGuests: 6 },
  "Private Room": { total: 4, maxGuests: 10 },
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateReservations(): Reservation[] {
  const reservations: Reservation[] = [];
  const startDate = new Date("2025-03-01");
  const endDate = new Date("2025-04-07");

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const numReservations = rand(8, 20);

    for (let i = 0; i < numReservations; i++) {
      const seatType = seatTypes[rand(0, 2)];
      const maxG = seatConfig[seatType].maxGuests;
      const guests = rand(1, maxG);
      const startHour = rand(11, 21);
      const duration = rand(1, 2);
      const endHour = Math.min(startHour + duration, 23);
      const isCancelled = Math.random() < 0.12;
      const bookedAtDate = new Date(d);
      bookedAtDate.setDate(bookedAtDate.getDate() - rand(1, 7));
      bookedAtDate.setHours(rand(8, 22), rand(0, 59));

      let cancelledAt: string | undefined;
      if (isCancelled) {
        const cancelDate = new Date(bookedAtDate);
        cancelDate.setHours(cancelDate.getHours() + rand(1, 72));
        cancelledAt = cancelDate.toISOString();
      }

      reservations.push({
        id: `res-${dateStr}-${i}`,
        guestName: names[rand(0, names.length - 1)],
        phone: `08${rand(1000000000, 9999999999)}`,
        date: dateStr,
        startTime: `${String(startHour).padStart(2, "0")}:00`,
        endTime: `${String(endHour).padStart(2, "0")}:00`,
        guests,
        seatType,
        status: isCancelled ? "cancelled" : "confirmed",
        bookedAt: bookedAtDate.toISOString(),
        cancelledAt,
      });
    }
  }
  return reservations;
}

export const reservations = generateReservations();

export const seatAvailability = {
  Counter: 8,
  Table: 12,
  "Private Room": 4,
};
