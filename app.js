const { MongoClient, ObjectId } = require("mongodb");

async function main() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("testdb");
        const users = db.collection("users");

        console.log("Connected to MongoDB");

        // 1- insertOne لإضافة مستخدمين
        const u1 = await users.insertOne({ name: "Ali", age: 25, city: "Riyadh" });
        console.log("Inserted user 1 ID:", u1.insertedId);

        const u2 = await users.insertOne({ name: "Sara", age: 30, city: "Jeddah" });
        console.log("Inserted user 2 ID:", u2.insertedId);

        // 2- insertMany لإضافة 10 مستخدمين (5 منهم عمرهم 27)
        const many = await users.insertMany([
            { name: "Logain", age: 27, city: "Dammam" },
            { name: "Ragda", age: 27, city: "Riyadh" },
            { name: "Maream", age: 27, city: "Jeddah" },
            { name: "Mais", age: 27, city: "Tabuk" },
            { name: "Lamar", age: 27, city: "Hail" },
            { name: "Faiz Aldeen", age: 20, city: "Abha" },
            { name: "Hussain", age: 22, city: "Najran" },
            { name: "Saef Aldeen", age: 35, city: "Makkah" },
            { name: "Aiz Aldeen", age: 40, city: "Taif" },
            { name: "Yousef", age: 29, city: "Qassim" }
        ]);

        console.log("Inserted many count:", many.insertedCount);

        // 3- find
        const age27 = await users.find({ age: 27 }).toArray();
        console.log("Users age 27:", age27);

        // 4- limit لإظهار أول 3 فقط
        const first3 = await users.find({ age: 27 }).limit(3).toArray();
        console.log("First 3 age 27:", first3);

        // 5- findOne باستخدام _id
        const found = await users.findOne({ _id: u1.insertedId });
        console.log("Found user:", found);

        // 6- countDocuments
        const count27 = await users.countDocuments({ age: 27 });
        console.log("Count age 27:", count27);

        // 7- updateOne
        const updateOne = await users.updateOne(
            { _id: u2.insertedId },
            { $set: { name: "Updated Sara" }, $inc: { age: 1 } }
        );
        console.log("Modified count:", updateOne.modifiedCount);

        // 8- updateMany لزيادة عمر الجميع 5 سنوات
        const updateMany = await users.updateMany({}, { $inc: { age: 5 } });
        console.log("Updated many:", updateMany.modifiedCount);

        // 9- deleteOne
        const delOne = await users.deleteOne({ _id: u1.insertedId });
        console.log("Deleted one:", delOne.deletedCount);

        // 10- deleteMany
        const delMany = await users.deleteMany({ age: 32 });
        console.log("Deleted many:", delMany.deletedCount);

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

main();