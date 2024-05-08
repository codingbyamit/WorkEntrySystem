const express = require("express");
const ADODB = require("node-adodb");

const serverDB = "./Tablas.mdb";
// const serverDB = "W:/test/Access/Tablas.mdb";

const serverConnection = ADODB.open(
    `Provider=Microsoft.Jet.OLEDB.4.0;Data Source=${serverDB};`
);
const path = require("path");

const app = express();
const cors = require("cors");
const { success, error } = require("./utils/Wrapper");
const { log } = require("console");
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("Hello World");
});

// operator Details data
app.post("/operatorDetails", (req, res) => {
    const { OperatorNumber } = req.body;
    const converInt = parseInt(OperatorNumber);

    serverConnection
        .query(
            `SELECT [CodPer],[CodMaq],[HorIni],[HorFin],[NumFas],[NumOrd],[CanPie],[TiePre] FROM [Ordenes de fabricación (historia/taller)] WHERE [CodPer] = ${converInt} AND [TiePre] = 2`
        )
        .then((result) => {
            if (result.length === 0 || result == []) {
                res.send(error(404, "Operator not Found", []));
            } else {
                res.send(success(200, "User Found", result));
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

// uid data
app.post("/uidInfo", async (req, res) => {
    const { UID } = req.body;
    try {
        await serverConnection
            .query(
                `SELECT [NumOrd],[ArtOrd],[PieOrd],[EntCli] FROM [Ordenes de fabricación] WHERE [NumOrd] = ${UID}`
            )
            .then((result) => {
                if (result == [] || result.length === 0) {
                    return res.send(error(404, "UID not Found", []));
                }
                return res.send(success(200, "UID Found", result));
            })
            .catch((err) => {
                res.send(err);
            });
    } catch (error) {
        console.log(error);
    }
});

// operator number & operator name
app.post("/operatorNumberInfo", async (req, res) => {
    const { OperatorNumber } = req.body;
    if (!OperatorNumber) {
        return res.send(error(404, "Please Provide Operator Number", []));
    }
    try {
        await serverConnection
            .query(
                `SELECT [CodPer],[NomPer] FROM [Personal] WHERE [CodPer] = ${parseInt(
                    OperatorNumber
                )}`
            )
            .then((result) => {
                if (result == [] || result.length === 0) {
                    return res.send(error(404, "Wrong Operator Number", []));
                }
                return res.send(success(200, "Operator Found", result));
            });
    } catch (error) {
        console.log(error);
    }
});
// machine number & machine name
app.post("/machineInfo", async (req, res) => {
    const { MachineNumber } = req.body;
    if (!MachineNumber) {
        return res.send(error(404, "Please Provide Machine Number", []));
    }
    try {
        await serverConnection
            .query(
                `SELECT [CodMaq],[TipMaq] FROM [Máquinas] WHERE [CodMaq] = ${MachineNumber}`
            )
            .then((result) => {
                if (result == [] || result.length === 0) {
                    return res.send(error(404, "Machine not Found", []));
                }
                return res.send(success(200, "Machine Found", result));
            })
            .catch((err) => {
                res.send(err);
            });
    } catch (error) {
        console.log(error);
    }
});
// operation number & operation name
app.post("/operationInfo", async (req, res) => {
    const { StepNo } = req.body;
    if (!StepNo) {
        return res.send(error(404, "Please Provide Step Number", []));
    }
    try {
        await serverConnection
            .query(
                `SELECT [NumFas],[Operac] FROM [Fases estandards] WHERE [NumFas] = ${parseInt(
                    StepNo
                )}`
            )
            .then((result) => {
                if (result == [] || result.length === 0) {
                    return res.send(error(404, "Wrong Step Number", []));
                }
                return res.send(success(200, "Operation Found", result));
            });
    } catch (error) {
        console.log(error);
    }
});

// save Data into Database
app.post("/saveData", async (req, res) => {
    const {
        OperatorNumber,
        MachineNumber,
        StartDateTime,
        StepNo,
        Operation,
        UID,
        Status,
    } = req.body;

    try {
        // const result = await serverConnection.query(
        //     `SELECT * FROM [Ordenes de fabricación (historia/taller)] WHERE [TiePre] = 1 AND [NumOrd] = ${UID} AND [CodPer] = ${OperatorNumber} AND [CodMaq] = ${MachineNumber} AND [NumFas] = ${StepNo}`
        // );
        const result2 = await serverConnection.query(
            `SELECT * FROM [Ordenes de fabricación (historia/taller)] WHERE [TiePre] = 2 AND [NumOrd] = ${UID} AND [CodPer] = ${OperatorNumber} AND [CodMaq] = ${MachineNumber} AND [NumFas] = ${StepNo}`
        );

        // if (result.length > 0 || result2.length > 0) {
        //     return res.send(error(500, "Data Already Exists", []));
        // }

        if (result2.length > 0) {
            return res.send(error(500, "Data Already Exists", []));
        }

        await serverConnection
            .execute(
                `INSERT INTO [Ordenes de fabricación (historia/taller)] (CodPer,CodMaq,HorIni,NumFas,NumOrd,[TiePre]) VALUES (${OperatorNumber},${MachineNumber},'${StartDateTime}',${StepNo},'${UID}',${Status})`
            )
            .then((result) => {
                return res.send(success(200, "Data Inserted Successfully", []));
            })
            .catch((err) => {
                return res.send(err);
            });
    } catch (error) {
        console.log(error);
    }
});

// update Data into Database
app.post("/updateData", async (req, res) => {
    const { Status, UID, NoOfPcs, finishTime, MachineNumber } = req.body;

    try {
        await serverConnection
            .execute(
                `UPDATE [Ordenes de fabricación (historia/taller)] SET [TiePre] = ${Status},  [CanPie] = ${NoOfPcs}, [HorFin] = '${finishTime}' WHERE [NumOrd] = ${UID} AND [CodMaq] = ${MachineNumber} AND [TiePre] = 2`
            )
            .then((result) => {
                return res.send(
                    success(200, "Data Updated Successfully", result)
                );
            })
            .catch((err) => {
                return res.send(error(500, "Data Not Updated", err));
            });
    } catch (error) {
        console.log(error);
    }
});

app.post("/getAllDataByOperatorNumber", (req, res) => {
    const { OperatorNumber } = req.body;
    serverConnection
        .query(
            `SELECT * FROM [Ordenes de fabricación (historia/taller)] WHERE [CodPer] = ${OperatorNumber} AND TiePre = 2`
        )
        .then((result) => {
            if (result.length === 0 || result == []) {
                res.send(error(404, "Please Entry Work Details", []));
            } else {
                res.send(success(200, "Data Found of this Operator", result));
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

const port = 5003;
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port} `);
});
