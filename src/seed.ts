import { faker } from "@faker-js/faker";
import db from ".";
import { productsTable } from "./db/schema";

function getRandomSku(): string {
    const letters: string = faker.string.alpha({ length: 2 }).toUpperCase();
    const numbers: number = faker.number.int({ min: 1000, max: 9999 });
    return `${letters}${numbers}`;
};

async function main() {
    const fakeProducts = Array.from({ length: 30 }).map((_, i) => ({
        name: faker.commerce.productName(),
        quantity: faker.number.int({ min: 1, max: 100 }),
        price: faker.number.float({ min: 0, max: 100 , fractionDigits: 2}),
        sku: getRandomSku(),
        userId: "e9906ed0-c499-47a8-ad34-aeddde98ddd6",
        createdAt: faker.date.past().toISOString().split("T")[0]
    }));

    await db.insert(productsTable).values(fakeProducts);
};

main()
    .then(_ => console.log("Seeding complete"))
    .catch(err => console.error("Seeding failed:", err));