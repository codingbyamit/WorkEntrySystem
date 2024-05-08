import { useEffect, useRef, useState } from "react";
import Avtar from "./Components/Avtar";
import axiosClient from "./utils/axiosClient";
import UserProfile from "./assets/operator.png";
import MachineImg from "./assets/machine.png";
import toast, { Toaster } from "react-hot-toast";
import Embed from "react-embed";
import DialogBox from "./Components/DialogBox";

function App() {
    const [OperatorNumber, setOperatorNumber] = useState("");
    const [OperatorName, setOperatorName] = useState("");
    const [MachineNumber, setMachineNumber] = useState("");
    const [MachineName, setMachineName] = useState("");
    const [StartDateTime, setStartDateTime] = useState("");
    const [OperatorImage, setOperatorImage] = useState(UserProfile);
    const [MachineImage, setMachineImage] = useState(MachineImg);
    const [UID, setUID] = useState();
    const [uidFilled, setUidFilled] = useState(false);
    const [Operation, setOperation] = useState("");
    const [StepNo, setStepNo] = useState("");
    const [article, setArticle] = useState("");
    const [orderQty, setOrderQty] = useState("");
    const [finishedQty, setFinishedQty] = useState("");
    const [pendingQty, setPendingQty] = useState("");
    const [finishTime, setFinishTime] = useState("");
    const [NoOfPcs, setNoOfPcs] = useState();
    const [Status, setStatus] = useState("");
    const [showToast, setShowToast] = useState(false); // New state for controlling toast visibility
    const [footerHidden, setFooterHidden] = useState(false);
    let value = OperatorNumber.split("-");
    
    const OperatorRef = useRef(null)
    const UIDInputRef = useRef(null);
    const acceptButton1Ref = useRef(null);
    const NoOfPcsInputRef = useRef(null);
    const [endValue, setEndValue] = useState(false);
    const [showPdf, setShowPdf] = useState(false);

    const [mNo , setMNo] = useState()
    const [sNo,setSNo] = useState()
    const [opNo,setOpNo] = useState()
    const [cUID,setCUID] = useState()
    

    const [dataInput,setDataInput] = useState()

    // console.log(cUID);

    const imagePath = `http://10.0.0.5:8080/Software/CSK/WorkEntrysystem(New)/WorkEntrysystem/OperatorPhotos`;
    const machinePath = `http://10.0.0.5:8080/Software/CSK/WorkEntrysystem(New)/WorkEntrysystem/MachinePhotos`;
    const pdf = `http://10.0.0.5:8080/test/Access/Planos/${article.slice(
        0,
        6
    )}/${article}.PT.pdf`;

    // async function imageExists(url) {
    //     try {
    //         const response = await fetch(url);
    //         if (response.status === 404) {
    //             return false;
    //         }
    //         return response.ok;
    //     } catch (error) {
    //         console.error("Error checking image:", error);
    //         return false;
    //     }
    // }

    function todayDateTime() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // Months are zero-indexed, so add 1
        const day = today.getDate();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();

        // Format the date string
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function formateDateTime(originalDate) {
        const dateObject = new Date(originalDate);

        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1; // Months are zero-indexed, so add 1
        const day = dateObject.getDate();
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const seconds = dateObject.getSeconds();

        // Format the date string
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    async function fetchOperatorData(OperatorNumber) {
        const response = await axiosClient.post("/operatorNumberInfo", {
            OperatorNumber,
        })
        return response.data
    }
    async function fetchMachineData(MachineNumber) {
        const response = await axiosClient.post("/machineInfo", {
            MachineNumber,
        })
        return response.data
    }
    async function fetchStepData(StepNo) {
        const response = await axiosClient.post("/operationInfo", {
            StepNo,
        })
        return response.data
    }




    useEffect(() => {
        async function handleOperatorData() {
            try {
             
                 const opName = await fetchOperatorData(opNo)
                 const mcName = await fetchMachineData(mNo)
                 const spName = await fetchStepData(sNo)
                 const operatorImage = `${imagePath}/${opNo}.jpg`
                 const machineImage = `${machinePath}/${mNo}.jpg`

                await axiosClient
                    .post("/operatorDetails", { OperatorNumber:opNo })
                    .then(async (res) => {
                        if (endValue === false) {
                            setOperatorImage(operatorImage);
                            setOperatorName(opName?.result[0]?.NomPer);
                            setMachineNumber(mNo)
                            setStepNo(sNo)
                            setMachineImage(machineImage);
                            setMachineName(mcName?.result[0]?.TipMaq);
                            setOperation(spName?.result[0]?.Operac);
                            setStartDateTime(todayDateTime());
                            setStatus(2)
                            UIDInputRef.current.focus();
                            return;
                        } 
                        
                        else if (endValue === true && res.data.statusCode === 404) {
                            setOperatorImage(operatorImage);
                            setMachineNumber(mNo)
                            setMachineImage(machineImage);
                            setOperatorName(opName?.result[0]?.NomPer);
                            setStepNo(sNo)
                            setMachineName(mcName?.result[0]?.TipMaq);
                            setOperation(spName?.result[0]?.Operac);
                            setStartDateTime(todayDateTime());
                            setStatus(2)
                            UIDInputRef.current.focus();
                            return;
                        } 
                        else if (res.data.result?.length === 1 && endValue === true) {
                            setOperatorImage(operatorImage);
                            setOperatorName(opName?.result[0]?.NomPer);
                            const currentData = res.data.result[0]
                            const machineImage = `${machinePath}/${currentData?.CodMaq}.jpg`
                            setMachineNumber(currentData?.CodMaq)
                            const mcName = await fetchMachineData(currentData?.CodMaq)
                            setMachineName(mcName?.result[0]?.TipMaq);
                            setMachineImage(machineImage)
                            setStepNo(currentData?.NumFas);
                            const stNo = await fetchStepData(currentData?.NumFas)
                            setOperation(stNo?.result[0]?.Operac);
                            setTimeout(() => {
                                setStartDateTime(
                                    formateDateTime(res.data?.result[0]?.HorIni)
                                );
                            }, 2000);
                            setEndValue(false);
                            setUID(res.data?.result[0]?.NumOrd);
                            const orderData = await fetchUIDOrder(
                                res.data?.result[0]?.NumOrd
                            );
                            setArticle(orderData?.result[0]?.ArtOrd);
                            setOrderQty(orderData?.result[0]?.PieOrd);
                            setPendingQty(
                                parseInt(orderData?.result[0]?.PieOrd) -
                                    parseInt(orderData?.result[0]?.EntCli) <
                                    0
                                    ? 0
                                    : parseInt(orderData?.result[0]?.PieOrd) -
                                          parseInt(orderData?.result[0]?.EntCli)
                            );
                            setFinishedQty(orderData?.result[0]?.EntCli);
                            setFooterHidden(true);
                            setFinishTime(todayDateTime());
                            setStatus(1);
                            setShowPdf(true);
                            setTimeout(() => {
                                NoOfPcsInputRef.current.focus();
                            }, 500);
                            return;
                        } 
                        
                        else if (endValue === true && res.data.result?.length > 1) {
                            
                            setOperatorImage(operatorImage);
                            setOperatorName(opName?.result[0]?.NomPer);
                            UIDInputRef.current?.focus();
                            const data = res.data?.result?.filter((item) => {
                                return item?.NumOrd == UID && item?.CodMaq == MachineNumber;
                            });
                            const machineImage = `${machinePath}/${data[0]?.CodMaq}.jpg`
                            setStartDateTime(
                                data[0]?.HorIni
                                    ? formateDateTime(data[0]?.HorIni)
                                    : ""
                            );
                            setMachineNumber(data[0]?.CodMaq)
                            const mcName = await fetchMachineData(data[0]?.CodMaq)
                            setMachineName(mcName?.result[0]?.TipMaq);
                            setMachineImage(machineImage)
                            setStepNo(data[0]?.NumFas)
                            const stOp = await fetchStepData(data[0]?.NumFas)
                            setOperation(stOp?.result[0]?.Operac);
                            const orderData = await fetchUIDOrder(UID);
                            setArticle(orderData?.result[0]?.ArtOrd);
                            setOrderQty(orderData?.result[0]?.PieOrd);
                            setPendingQty(
                                parseInt(orderData?.result[0]?.PieOrd) -
                                    parseInt(orderData?.result[0]?.EntCli) <
                                    0
                                    ? 0
                                    : parseInt(orderData?.result[0]?.PieOrd) -
                                          parseInt(orderData?.result[0]?.EntCli)
                            );
                            setFinishedQty(orderData?.result[0]?.EntCli);
                            setFooterHidden(true);
                            setFinishTime(todayDateTime());
                            setStatus(1);
                            setShowPdf(true);
                            setTimeout(() => {
                                NoOfPcsInputRef.current.focus();
                            }, 1000);
                            return;
                        }
                    });
            } catch (error) {
                console.log(error);
            }
        }

        // Trigger the API call when all relevant values are set
        if (OperatorNumber !== "" && sNo !== "" && mNo !== "") {
            handleOperatorData();
        }
    }, [opNo,sNo,mNo,cUID]); // Dependencies for useEffect

    // const handleUIDKeyPress = (e)=>{
    //     if(e.key === "Enter"){
            
    //     }
    // }

    useEffect(() => {

        const UIDValue = typeof UID === "string" ? UID.split(" ") : null;
        const handleUIDScan = async (event) => {
            if (event.key !== "Enter") return;

            const isUIDInput = event.target.id === "UID";
            if (!isUIDInput) return;



            

            
            let curUID = UIDValue[1];
            setCUID(curUID)

            if(UIDValue[0] !== "W"){
                curUID = UIDValue[0]
                setCUID(curUID)
                
                // setUID(UIDValue[0])
                // console.log(UID);
                // console.log(cUID);
            }

            const containsAlphabets = /[a-zA-Z]/.test(curUID);
            

            if (curUID && curUID?.length === 6 && !containsAlphabets) {
            setUID(curUID);
        } else {
            // if (!showToast) {
                // setShowToast(true);
                toast.error("UID Invalid");
            // }
            setUID("");
            UIDInputRef.current.focus();
        }
           
        };

        // Attach event listener to document
        document.addEventListener("keydown", handleUIDScan);

        // Clean up event listener
        return () => {
            document.removeEventListener("keydown", handleUIDScan);
        };
    }, [UID]);
    
    useEffect(() => {
        handleUIDdata()
    },[cUID])


    async function handleUIDdata() {
            try {
                if(UID?.length > 0){
                    setStartDateTime(todayDateTime());
                    const res = await fetchUIDOrder(UID)
                    // console.log(res);
                    setArticle(res.result[0]?.ArtOrd)
                    setOrderQty(res.result[0]?.PieOrd)
                    setPendingQty(parseInt(res.result[0]?.PieOrd) -
                                    parseInt(res.result[0]?.EntCli) <
                                    0
                                    ? 0
                                    : parseInt(res.result[0]?.PieOrd) -
                                          parseInt(
                                              res.result[0]?.EntCli
                                          ))
                    setFinishedQty(res.result[0]?.EntCli)
                    setTimeout(() => {
                        acceptButton1Ref.current.focus()
                        setUidFilled(true)
                    }, 200);
                    return;
                }
            } 
            catch (err) {
                console.log(err);
            }
    }

    // console.log(UID);

    async function fetchUIDOrder(UID) {
        try {
            const response = await axiosClient.post("/uidInfo", { UID });
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching order data:", error);
            throw error; // Rethrow the error to handle it in the calling function
        }
    }


    useEffect(() => {
        if (uidFilled) {
            acceptButton1Ref.current.click(); // Trigger the click event when UID is filled
            setUidFilled(false); // Reset the UID filled status
            return;
        }
    }, [uidFilled]);

    async function submitData() {
        if(!UID && !OperatorNumber && !OperatorName && !MachineNumber && !MachineName && !StepNo){
            toast.error("Please Fill All Fields");
            OperatorRef.current.focus()
            return
            
            
        }
        await axiosClient
            .post("/saveData", {
                OperatorNumber,
                OperatorName,
                MachineNumber,
                MachineName,
                StartDateTime,
                StepNo,
                Operation,
                UID,
                Status,
            })
            .then((res) => {
                console.log(res.data);
                if(res.data.status === "OK" && res.data.statusCode === 200){
                    toast.success(res.data.message);
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);    
                }
                else if (res.data.status === "Error" && res.data.statusCode === 500) {
                   toast.error(res.data.message);
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                }
            })
            .catch((err) => {
                console.log(err);
                
            });
    }

    function getUIDFromChild(uid,machineNo, dropboxValue) {
        // console.log(uid,machineNo, dropboxValue);
        setMachineNumber(machineNo)
        if (uid.length < 1) {
            setEndValue(false);
            return;
        }
        setUID(uid);
        setCUID(uid)
        setTimeout(() => {
            setEndValue(dropboxValue);
        }, 1000);
    }

    // console.log(OperatorNumber);
    console.log(value);

    useEffect(() => {
        const handleBarcodeScan = async (event) => {
            if (event.key !== "Enter") return;

            const isOperatorInput = event.target.id === "operator";
            if (!isOperatorInput) return;

            const operatorValue = value[0];
            const machineValue = value[1];
            const stepValue = value[2];
            const endValue = value[3];

            setMNo(machineValue)
            setSNo(stepValue)
            setOpNo(operatorValue)

            if (operatorValue && operatorValue.length > 0) {
                setOperatorNumber(operatorValue);
            }

            if (endValue && endValue.length > 0 && value.length > 3) {
                setEndValue(true);
            }
             if (OperatorNumber.slice(-1) === "0") {
            // If the last character of OperatorNumber is '0'
            setMachineNumber("");
            setStepNo("");
        } else {
            setMachineNumber(machineValue);
            setStepNo(stepValue);
        }

        };

        // Attach event listener to document
        document.addEventListener("keydown", handleBarcodeScan);

        // Clean up event listener
        return () => {
            document.removeEventListener("keydown", handleBarcodeScan);
        };
    }, [value]);
    // console.log(UID);
    // console.log(cUID);
    // console.log(NoOfPcs);
    async function updateData(e) {        
        if (NoOfPcs === undefined && e.key === "Enter" || e.type === "click") {
            if (!showToast) {
                setShowToast(true);
                toast.error("Please Enter NoOfPcs");
            }
            setShowToast(false);
            NoOfPcsInputRef.current.focus();
            return;
        } else if (NoOfPcs?.length > 0 && e.key === "Enter" || e.type === "click") {
            setFinishTime(todayDateTime());
            const np = parseInt(NoOfPcs);
            try {
                await axiosClient
                    .post("/updateData", {
                        finishTime,
                        Status,
                        UID,
                        NoOfPcs: np,
                        MachineNumber,
                    })
                    .then((res) => {
                        console.log(res.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                toast.success("Data Updated Successfully");
                window.location.reload();
            } catch (error) {
                console.log(error);
            }
        }
    }

    function handleCancel() {
        window.location.reload();
    }

    return (
        <div className="container m-auto w-full h-screen">
            <Toaster />
            {endValue && (
                <DialogBox
                    hidden={endValue}
                    onSubmit={getUIDFromChild}
                    OperatorNumber={OperatorNumber}
                />
            )}

            <h1 className="text-3xl font-bold underline text-center">
                Work Entry System
            </h1>
            <div className="flex">
                <div className="left w-[60%] h-full p-5 border">
                    <div className="px-5 py-5 flex gap-5 items-center justify-evenly ">
                        <div className="flex">
                            <div className="mr-5">
                                <Avtar src={OperatorImage} />
                                <h1>Operator Image</h1>
                            </div>
                            <div>
                                <Avtar src={MachineImage} />
                                <h1>Machine Image</h1>
                            </div>
                        </div>
                        <div>
                            <div>
                                <label htmlFor="operator">Operator No.</label>
                                <input
                                    ref={OperatorRef}
                                    autoFocus={true}
                                    className="block border-2 px-4 py-1 w-60 font-bold rounded-lg text-[25px] text-center mb-3"
                                    type="text"
                                    name="OperatorNumber"
                                    id="operator"
                                    autoComplete="off"

                                    value={OperatorNumber}
                                    // onKeyDown={handleOperatorData}
                                    onChange={(e) =>
                                        setOperatorNumber(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="name">Operator Name</label>
                                <input
                                    className="block border-2 px-2 py-1 w-60 text-center rounded-lg text-[20px] font-bold"
                                    type="text"
                                    id="name"
                                    name="OperatorName"
                                    value={OperatorName}
                                    disabled
                                    onChange={(e) =>
                                        setOperatorName(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-evenly gap-1 mt-3">
                        <div>
                            <label htmlFor="StepNo">Step No.</label>
                            <input
                                className="block w-[150px] text-center border-2 px-4 py-1 rounded-lg"
                                type="number"
                                id="StepNo"
                                name="StepNo"
                                disabled
                                onChange={(e) => {
                                    setStepNo(e.target.value);
                                }}
                                value={StepNo}
                            />
                        </div>
                        <div>
                            <label htmlFor="Operation">Operation</label>
                            <input
                                className="block w-[250px] border-2 px-4 py-1 rounded-lg"
                                type="text"
                                id="Operation"
                                name="Operation"
                                disabled
                                value={Operation}
                                onChange={(e) => setOperation(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="UID">UID</label>
                            <input
                                // autoComplete={false}
                                autoComplete="off"
                                required={true}
                                ref={UIDInputRef}
                                className="block w-[150px] border-2 px-4 py-1 rounded-lg"
                                type="text"
                                id="UID"
                                name="UID"
                                value={UID}
                                // onKeyDown={handleUIDdata}
                                onChange={(e) => {
                                    setUID(e.target.value);
                                    setDataInput(e.target.value)
                                }}
                            />
                        </div>

                        <div className={`${footerHidden ? "hidden" : ""}`}>
                            <button
                                ref={acceptButton1Ref}
                                onClick={submitData}
                                className="block border-2 px-2 py-1 w-28 rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-700"
                            >
                                Accept
                            </button>
                            <button
                                onClick={handleCancel}
                                className="block bg-red-500 px-3 py-1 w-28 rounded-lg font-semibold text-white hover:bg-red-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-3 grid-rows-3 px-5 py-5 gap-5 justify-center items-center mt-8  ">
                            <div>
                                <label htmlFor="StartDateTime">
                                    Start Date & Time
                                </label>
                                <input
                                    className="block border-2  px-4 py-1 rounded-lg"
                                    type="text"
                                    id="StartDateTime"
                                    name="StartDateTime"
                                    disabled
                                    value={StartDateTime}
                                    onChange={(e) => {
                                        setStartDateTime(e.target.value);
                                    }}
                                />
                            </div>
                            <div>
                                <label htmlFor="machine">Machine No.</label>
                                <input
                                    className="block border-2 px-4 py-1 rounded-lg"
                                    type="text"
                                    id="machine"
                                    name="MachineNumber"
                                    disabled
                                    onChange={(e) => {
                                        setMachineNumber(e.target.value);
                                    }}
                                    value={MachineNumber}
                                />
                            </div>
                            <div>
                                <label htmlFor="machine">Machine Name</label>
                                <input
                                    className="block border-2 px-4 py-1 rounded-lg"
                                    type="text"
                                    id="machine"
                                    name="MachineName"
                                    disabled
                                    value={MachineName}
                                    onChange={(e) =>
                                        setMachineName(e.target.value)
                                    }
                                />
                            </div>
                            {/* <div>
                                <label htmlFor="article">Article</label>
                                <input
                                    className="block border-2 px-4 py-1 rounded-lg"
                                    type="text"
                                    id="article"
                                    name="article"
                                    onChange={(e) => setArticle(e.target.value)}
                                    value={article}
                                />
                            </div> */}
                            <div>
                                <label htmlFor="orderQty">Order Qty</label>
                                <input
                                    className="block border-2 px-4 py-1 rounded-lg"
                                    type="text"
                                    id="orderQty"
                                    name="orderQty"
                                    value={orderQty}
                                    disabled
                                    onChange={(e) =>
                                        setOrderQty(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label htmlFor="pendingQty">PendingQty</label>
                                <input
                                    className="block border-2 px-4 py-1 rounded-lg"
                                    type="text"
                                    id="pendingQty"
                                    name="pendingQty"
                                    disabled
                                    value={pendingQty}
                                    onChange={(e) =>
                                        setPendingQty(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label htmlFor="finished">Finished Qty</label>
                                <input
                                    className="block border-2 px-4 py-1 rounded-lg"
                                    type="text"
                                    id="finished"
                                    name="finishedQty"
                                    disabled
                                    value={finishedQty}
                                    onChange={(e) =>
                                        setFinishedQty(e.target.value)
                                    }
                                />
                            </div>

                            <div className={`${!footerHidden ? "hidden" : ""}`}>
                                <label htmlFor="finishTime">
                                    Finish Date & Time
                                </label>
                                <input
                                    className="block border-2 px-4 py-1 rounded-lg"
                                    type="text"
                                    name="finishTime"
                                    id="finishTime"
                                    disabled
                                    value={finishTime}
                                    onChange={(e) => {
                                        setFinishTime(e.target.value);
                                    }}
                                />
                            </div>
                            <div className={`${!footerHidden ? "hidden" : ""}`}>
                                <label htmlFor="NoOfPcs">No. Of Pices</label>
                                <input
                                    ref={NoOfPcsInputRef}
                                    required
                                    className="block border-2 px-4 py-1 rounded-lg"
                                    type="number"
                                    name="NoOfPcs"
                                    id="NoOfPcs"
                                    value={NoOfPcs}
                                    onKeyDown={updateData}
                                    onChange={(e) => setNoOfPcs(e.target.value)}
                                />
                            </div>
                            <div
                                className={` ${
                                    !footerHidden ? "hidden" : ""
                                } flex justify-center items-center mt-5 gap2`}
                            >
                                <button
                                    type="submit"
                                    onClick={updateData}
                                    className=" border-2 px-2 py-1 w-28 rounded-lg bg-blue-500 font-semibold text-white hover:bg-blue-700"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className=" bg-red-500 px-3 py-1 w-28 rounded-lg font-semibold text-white hover:bg-red-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="embed-container right w-[40%] border">
                    {showPdf ? <Embed className="h-full" url={pdf} /> : ""}
                </div>
            </div>
        </div>
    );
}

export default App;
