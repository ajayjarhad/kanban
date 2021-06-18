const Mongoose = require('mongoose');
const cardSchema = new Mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        rquired: true,
    },
    description: String,
    position: {
        type: Number,
        required: true
    },
    columnId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Column",
    },
},
    { timestamp: true },
);

class Card{
    static insertCard(cardInfo) {
        const card = this(cardInfo);
        return card.save();
    }
    static getCardByColumnId(columnId) {
        return this.find({ columnId }).sort('poisiton').exec();
    }
    static updatePos(cardId, position, columnId) {
        return this.findOneAndUpdate({
            _id: Mongoose.mongo.ObjectId(cardId),
        },
            {
                $set: {
                    position,
                    columnId,
                },
            }
        ).exec();
    }
}

cardSchema.loadClass(Card);
module.exports = Mongoose.model("Card", cardSchema)