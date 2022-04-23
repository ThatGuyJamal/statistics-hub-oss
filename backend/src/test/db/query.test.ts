import {GuildDocumentModel} from "../../lib/database/guild/guild.model" 

const query = GuildDocumentModel

query.findOneAndUpdate(
    {_id: '123'},
    {
        $set: {
            premium: {
                paymentId: '123',
                status: true,
                tier: 1,
                total_guilds_enabled: 1
            }
        }
    },
    {
        upsert: true,
        new: true
    }
).then((doc) => {
    console.log(doc)
})