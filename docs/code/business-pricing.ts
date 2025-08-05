// Create business entities
const Customer = createClass(
    "customer",
    function (id: string, tier: string) {
        this.id = id;
        this.tier = tier;
    },
    {
        discountRate: 0,
        loyaltyPoints: 0,
    }
);

const Product = createClass(
    "product",
    function (id: string, name: string, basePrice: number) {
        this.id = id;
        this.name = name;
        this.basePrice = basePrice;
    },
    {
        category: "general",
        inStock: true,
    }
);

const Order = createClass(
    "order",
    function (customerId: string, items: any[]) {
        this.customerId = customerId;
        this.items = items;
    },
    {
        total: 0,
        discountApplied: 0,
        status: "pending",
    }
);

// Register entities
Ryle.register("customer", Customer);
Ryle.register("product", Product);
Ryle.register("order", Order);

// Create pricing rules
const discountRule = Ryle("Apply discount to [customer] for [order]");
const loyaltyRule = Ryle("Award loyalty points to [customer] for [order]");

const discountHandler = discountRule.handler(
    (
        customer: InstanceType<typeof Customer>,
        order: InstanceType<typeof Order>
    ) => {
        let discountRate = 0;

        // Tier-based discounts
        switch (customer.tier) {
            case "bronze":
                discountRate = 0.05; // 5%
                break;
            case "silver":
                discountRate = 0.1; // 10%
                break;
            case "gold":
                discountRate = 0.15; // 15%
                break;
        }

        // Volume discounts
        if (order.total > 1000) {
            discountRate += 0.05; // Additional 5% for orders over $1000
        }

        const discount = order.total * discountRate;
        order.discountApplied = discount;
        order.total -= discount;

        console.log(
            `Applied ${(discountRate * 100).toFixed(
                1
            )}% discount: $${discount.toFixed(2)}`
        );
    }
);

const loyaltyHandler = loyaltyRule.handler(
    (
        customer: InstanceType<typeof Customer>,
        order: InstanceType<typeof Order>
    ) => {
        const pointsEarned = Math.floor(order.total / 10); // 1 point per $10
        customer.loyaltyPoints += pointsEarned;
        console.log(`${customer.id} earned ${pointsEarned} loyalty points`);
    }
);

// Usage
const customer = new Customer("CUST001", "silver");
const product1 = new Product("PROD001", "Laptop", 1200);
const product2 = new Product("PROD002", "Mouse", 25);

const order = new Order(customer.id, [product1, product2]);
order.total = product1.basePrice + product2.basePrice;

discountHandler([customer, order]);
loyaltyHandler([customer, order]);
