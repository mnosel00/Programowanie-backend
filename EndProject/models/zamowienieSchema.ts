const mongooseZamowienie = require("mongoose");
const SchemaZamowienie = mongooseZamowienie.Schema;

let zamowienieSchema = new SchemaZamowienie(
  {
    pracownik: [
      {
        type: SchemaZamowienie.Types.ObjectArray,
        ref: "Pracownik",
        required: true,
      },
    ],
    pozycje: [
      {
        type: SchemaZamowienie.Types.ObjectArray,
        ref: "Danie",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: ["zlozone", "w realizacji", "zrealizowane", "rachunek"],
      required: true,
    },
    stolik: [
      {
        type: SchemaZamowienie.Types.ObjectArray,
        ref: "Stolik",
        required: true,
      },
    ],
    kwota: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Zamowienie = mongooseZamowienie.model("Zamowienie", zamowienieSchema);
module.exports = Zamowienie;
