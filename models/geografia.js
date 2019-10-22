var Helper = require("./helperMongo");

var dbobj = {};

dbobj.ListDepartamentos = async () => {
    try {
        db = Helper.getInstance();

        /*const projection = {
            cdpto: 1,
            dpto: 1            
        };

        let orden = {dpto: 1};

        let ret = await db.collection("geografia")
            .sort(orden)
            .project(projection)
            .toArray();
*/
        var options = { allowDiskUse: true };

        var pipeline = [
            {
                "$project": {
                    "cdpto": "$cdpto",
                    "dpto": "$dpto",
                    "_id": 0
                }
            },
            {
                "$group": {
                    "_id": null,
                    "distinct": {
                        "$addToSet": "$$ROOT"
                    }
                }
            },
            {
                "$unwind": {
                    "path": "$distinct",
                    "preserveNullAndEmptyArrays": false
                }
            },
            {
                "$replaceRoot": {
                    "newRoot": "$distinct"
                }
            },
            {
                "$sort": {
                    "dpto": 1
                }
            }
        ];

        let ret = await db.collection("geografia").aggregate(pipeline, options).toArray();
        return ret;
    } catch (error) {
        console.log(error);
    }
}

dbobj.ListCiudades = async (lcdpto) => {
    try {
        db = Helper.getInstance();

        var query = { cdpto: lcdpto };

        var projection = {
            _id: "$_id",
            cmpio: "$cmpio",
            mpio: "$mpio"
        };

        var sort = { mpio: 1 };

        return db.collection("geografia").find(query).project(projection).sort(sort).toArray();
    } catch (error) {
        console.log(error);
    }
}


module.exports = dbobj