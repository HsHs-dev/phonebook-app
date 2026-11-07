const mongoose = require("mongoose");

const cmdArgs = 5;

if (process.argv.length !== cmdArgs) {
  console.log("Usage: <password> <name> <phone number>");
  return;
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://officialhassansmail_db_user:${password}@cluster0.rzmmlpj.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Entry = mongoose.model("Entry", entrySchema);

const entry = new Entry({
  name: name,
  number: number,
});

entry.save().then((result) => {
  console.log(`added ${name} number ${number} to phonebook`);
  mongoose.connection.close();
});
