import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";
import car3 from "@/assets/car-3.jpg";
import car4 from "@/assets/car-4.jpg";
import moto1 from "@/assets/moto-1.jpg";
import moto2 from "@/assets/moto-2.jpg";
import quad1 from "@/assets/quad-1.jpg";
import lancha1 from "@/assets/lancha-1.jpg";

export type VehicleType = "auto" | "moto" | "cuatriciclo" | "lancha";

export type Vehicle = {
  id: string;
  slug: string;
  type: VehicleType;
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
  km: number;
  fuel: string;
  transmission: string;
  engine: string;
  color: string;
  location: string;
  doors?: number;
  images: string[];
  highlights: string[];
  featured: boolean;
  addedDaysAgo: number;
};

export const TYPE_LABEL: Record<VehicleType, string> = {
  auto: "Auto",
  moto: "Moto",
  cuatriciclo: "Cuatriciclo",
  lancha: "Lancha",
};

const galleries: Record<VehicleType, string[][]> = {
  auto: [
    [car1, car4, car3],
    [car2, car3, car1],
    [car3, car1, car4],
    [car4, car2, car3],
  ],
  moto: [
    [moto1, moto2],
    [moto2, moto1],
  ],
  cuatriciclo: [[quad1, moto2]],
  lancha: [[lancha1, car3]],
};

type Row = [
  VehicleType,
  string,
  string,
  string,
  number,
  number,
  number,
  string,
  string,
  string,
  string,
  string,
];

const rows: Row[] = [
  ["auto", "Volkswagen", "Gol Trend", "1.6 Trendline 5P", 2018, 9800, 78000, "Nafta", "Manual", "1.6 101cv", "Gris Platino", "Villa Ballester", "5"],
  ["auto", "Toyota", "Etios", "1.5 XLS Sedán", 2019, 11500, 62000, "Nafta", "Manual", "1.5 103cv", "Blanco", "San Martín", "4"],
  ["auto", "Chevrolet", "Onix", "1.4 LTZ", 2017, 9200, 94000, "Nafta", "Manual", "1.4 98cv", "Rojo", "San Martín", "5"],
  ["auto", "Ford", "Ka", "1.5 SE Plus", 2018, 8900, 71000, "Nafta", "Manual", "1.5 123cv", "Negro", "Villa Ballester", "5"],
  ["auto", "Renault", "Sandero", "1.6 Privilege", 2016, 7800, 108000, "Nafta", "Manual", "1.6 105cv", "Gris", "José León Suárez", "5"],
  ["auto", "Peugeot", "208", "1.6 Allure", 2019, 12400, 55000, "Nafta", "Manual", "1.6 115cv", "Azul", "San Martín", "5"],
  ["auto", "Fiat", "Cronos", "1.3 Drive GSE", 2021, 13900, 38000, "Nafta", "Manual", "1.3 99cv", "Blanco", "Villa Ballester", "4"],
  ["auto", "Volkswagen", "Amarok", "2.0 TDI Highline 4x4", 2017, 27500, 132000, "Diésel", "Automática", "2.0 180cv", "Gris Oscuro", "San Martín", "4"],
  ["auto", "Toyota", "Hilux", "2.8 SRV 4x4", 2019, 38500, 98000, "Diésel", "Automática", "2.8 177cv", "Plata", "San Martín", "4"],
  ["auto", "Ford", "Ranger", "3.2 XLT 4x4", 2018, 32000, 115000, "Diésel", "Automática", "3.2 200cv", "Negro", "Villa Ballester", "4"],
  ["auto", "Chevrolet", "S10", "2.8 LTZ 4x2", 2016, 24500, 148000, "Diésel", "Manual", "2.8 200cv", "Blanco", "José León Suárez", "4"],
  ["auto", "Jeep", "Renegade", "1.8 Sport AT", 2019, 19800, 67000, "Nafta", "Automática", "1.8 139cv", "Gris", "San Martín", "5"],
  ["auto", "Nissan", "Kicks", "1.6 Advance CVT", 2020, 21500, 49000, "Nafta", "Automática", "1.6 120cv", "Blanco", "Villa Ballester", "5"],
  ["auto", "Honda", "HR-V", "1.8 EXL CVT", 2018, 22400, 84000, "Nafta", "Automática", "1.8 140cv", "Negro", "San Martín", "5"],
  ["auto", "Volkswagen", "T-Cross", "1.6 Comfortline AT", 2021, 24900, 41000, "Nafta", "Automática", "1.6 110cv", "Gris Platino", "San Martín", "5"],
  ["auto", "Citroën", "C3", "1.6 Feel", 2017, 8700, 96000, "Nafta", "Manual", "1.6 115cv", "Beige", "Villa Ballester", "5"],
  ["auto", "Renault", "Duster", "1.6 Dynamique", 2018, 14200, 88000, "Nafta", "Manual", "1.6 110cv", "Marrón", "José León Suárez", "5"],
  ["auto", "Fiat", "Toro", "2.0 Volcano 4x4 AT", 2020, 28900, 73000, "Diésel", "Automática", "2.0 170cv", "Blanco", "San Martín", "4"],
  ["auto", "Volkswagen", "Vento", "2.0 TSI Highline", 2015, 15800, 121000, "Nafta", "Automática", "2.0 211cv", "Negro", "Villa Ballester", "4"],
  ["auto", "Toyota", "Corolla", "1.8 XEI CVT", 2020, 23800, 52000, "Nafta", "Automática", "1.8 144cv", "Plata", "San Martín", "4"],
  ["auto", "Chevrolet", "Cruze", "1.4 LTZ Turbo", 2019, 18900, 69000, "Nafta", "Automática", "1.4 153cv", "Azul", "San Martín", "5"],
  ["auto", "Peugeot", "2008", "1.6 Feline", 2018, 15400, 79000, "Nafta", "Manual", "1.6 115cv", "Gris", "Villa Ballester", "5"],
  ["auto", "Ford", "EcoSport", "1.5 SE", 2017, 12800, 102000, "Nafta", "Manual", "1.5 123cv", "Rojo", "José León Suárez", "5"],
  ["auto", "Honda", "Fit", "1.5 EX CVT", 2016, 11200, 112000, "Nafta", "Automática", "1.5 120cv", "Blanco", "San Martín", "5"],
  ["moto", "Honda", "Tornado", "XR 250", 2019, 3900, 21000, "Nafta", "Manual", "250cc", "Negro", "San Martín", ""],
  ["moto", "Yamaha", "FZ-S", "FI 150 V3", 2021, 3200, 12500, "Nafta", "Manual", "149cc", "Azul", "Villa Ballester", ""],
  ["moto", "Honda", "CB", "190R", 2020, 3400, 16800, "Nafta", "Manual", "184cc", "Rojo", "San Martín", ""],
  ["moto", "Bajaj", "Rouser", "NS 200", 2022, 3600, 9400, "Nafta", "Manual", "199cc", "Negro Mate", "José León Suárez", ""],
  ["moto", "Yamaha", "XTZ", "250 Lander", 2018, 4100, 28500, "Nafta", "Manual", "249cc", "Azul", "San Martín", ""],
  ["moto", "Suzuki", "V-Strom", "650 XT", 2019, 8900, 32000, "Nafta", "Manual", "645cc", "Amarillo", "San Martín", ""],
  ["moto", "Honda", "Africa Twin", "CRF 1000L", 2017, 13500, 46000, "Nafta", "Manual", "998cc", "Blanco", "Villa Ballester", ""],
  ["moto", "Kawasaki", "Versys", "650", 2018, 8200, 38000, "Nafta", "Manual", "649cc", "Verde", "San Martín", ""],
  ["moto", "Motomel", "Skua", "150 Silver", 2021, 1800, 8200, "Nafta", "Manual", "150cc", "Gris", "José León Suárez", ""],
  ["moto", "Zanella", "RX", "150 Z7", 2020, 1500, 14500, "Nafta", "Manual", "150cc", "Negro", "Villa Ballester", ""],
  ["cuatriciclo", "Honda", "TRX", "420 Fourtrax 4x4", 2019, 7900, 4200, "Nafta", "Automática", "420cc", "Rojo", "San Martín", ""],
  ["cuatriciclo", "Yamaha", "Grizzly", "700 EPS", 2018, 9600, 6100, "Nafta", "Automática", "686cc", "Negro", "Villa Ballester", ""],
  ["cuatriciclo", "Can-Am", "Outlander", "570 DPS", 2021, 11200, 2800, "Nafta", "Automática", "570cc", "Amarillo", "San Martín", ""],
  ["cuatriciclo", "Gamma", "Ranger", "250 Full", 2020, 3200, 3600, "Nafta", "Automática", "250cc", "Negro", "José León Suárez", ""],
  ["cuatriciclo", "Polaris", "Sportsman", "450 HO", 2017, 6800, 8900, "Nafta", "Automática", "450cc", "Azul", "San Martín", ""],
  ["lancha", "Quicksilver", "Open", "450 c/ Mercury 40HP", 2016, 12500, 320, "Nafta", "Manual", "40 HP", "Blanco", "Tigre", ""],
  ["lancha", "Trakker", "Semirrígido", "480 c/ Yamaha 60HP", 2018, 16800, 210, "Nafta", "Manual", "60 HP", "Gris", "Tigre", ""],
  ["lancha", "Bermuda", "Sport", "170 c/ Evinrude 90HP", 2014, 18900, 480, "Nafta", "Manual", "90 HP", "Blanco", "Tigre", ""],
  ["lancha", "Regnicoli", "Tracker", "500 c/ Suzuki 70HP", 2019, 21500, 150, "Nafta", "Manual", "70 HP", "Beige", "Tigre", ""],
  ["lancha", "Albatros", "Cabinada", "560 c/ Mercury 115HP", 2015, 24900, 390, "Nafta", "Manual", "115 HP", "Blanco", "Tigre", ""],
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const checklistBase = [
  "Motor y caja verificados en banco",
  "Service al día con historial",
  "Documentación y transferencia sin deuda",
  "Informe de dominio y verificación policial",
];

export const vehicles: Vehicle[] = rows.map((row, index) => {
  const [type, brand, model, version, year, price, km, fuel, transmission, engine, color, location, doors] =
    row;
  const pool = galleries[type];
  return {
    id: `v-${index + 1}`,
    slug: slugify(`${brand}-${model}-${version}-${year}-${index + 1}`),
    type,
    brand,
    model,
    version,
    year,
    price,
    km,
    fuel,
    transmission,
    engine,
    color,
    location,
    doors: doors ? Number(doors) : undefined,
    images: pool[index % pool.length]!,
    highlights: checklistBase,
    featured: index % 7 === 0,
    addedDaysAgo: (index * 3) % 60,
  };
});

export const getVehicleBySlug = (slug: string) => vehicles.find((v) => v.slug === slug);
export const getVehicleById = (id: string) => vehicles.find((v) => v.id === id);

export const featuredVehicles = vehicles.filter((v) => v.featured).slice(0, 6);
export const newestVehicles = [...vehicles]
  .sort((a, b) => a.addedDaysAgo - b.addedDaysAgo)
  .slice(0, 4);

export const brandsByType = (type: VehicleType | "todos") =>
  Array.from(
    new Set(vehicles.filter((v) => type === "todos" || v.type === type).map((v) => v.brand)),
  ).sort();

export const priceRange: [number, number] = [
  Math.min(...vehicles.map((v) => v.price)),
  Math.max(...vehicles.map((v) => v.price)),
];
export const kmRange: [number, number] = [0, Math.max(...vehicles.map((v) => v.km))];
export const yearRange: [number, number] = [
  Math.min(...vehicles.map((v) => v.year)),
  Math.max(...vehicles.map((v) => v.year)),
];
