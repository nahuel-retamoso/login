const faker = require('faker');

const generateProduct = () => {
    const products = [];
    for (let i = 0; i < 5; i++) {
        products.push({
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            thumbnail: faker.image.image()
        })
    }
    return products;
}

module.exports = {generateProduct};