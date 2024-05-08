import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../utils/axiosClient";

function DialogBox({ hidden, OperatorNumber, onSubmit }) {
    const [data, setData] = useState([]);
    // const [uid, setUID] = useState("");
    const [OperatorName, setOperatorName] = useState("");
    const [OpNumber, setOpNumber] = useState("");
    const tableRef = useRef(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    function SubmitData(uid,machineNo, dropboxValue) {
            onSubmit(uid,machineNo, dropboxValue);
            // setUID("");
            return;
        }
        

    
    if(data?.length === 1){
        hidden = true;
    }
    

    useEffect(() => {
        tableRef.current.focus();

        if(tableRef.current){
             const handleKeyDown = (e) => {
            if (e.key === "ArrowUp" && selectedIndex > 0) {
                setSelectedIndex(selectedIndex - 1);
            } else if (
                e.key === "ArrowDown" &&
                selectedIndex < data?.length - 1
            ) {
                setSelectedIndex(selectedIndex + 1);
            }
            else if(e.key === "Enter" && e.keyCode === 13 || e.type === "click"){
                SubmitData(data[selectedIndex]?.NumOrd,data[selectedIndex]?.CodMaq, false)
                return;
            }
        };

        

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
        }
       
    }, [data,selectedIndex]);

    // console.log(selectedIndex);


    useEffect(() => {
        axiosClient
            .post("/getAllDataByOperatorNumber", { OperatorNumber })
            .then((res) => {
                setData(res.data.result);
            })
            .catch((err) => {
                console.log(err);
            });
        axiosClient
            .post("/operatorNumberInfo", { OperatorNumber })
            .then((res) => {
                setOperatorName(res.data.result[0]?.NomPer);
                setOpNumber(res.data.result[0]?.CodPer);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [OperatorNumber]);

    return (
    <div
        className={`${
            hidden && !data?.length === 1 && !data?.length<1 || data?.length> 1 ? "block" : "hidden"
        } animation-slideDown absolute top-[358px] left-[510px] w-[130px] h-auto py-2 px-2 bg-gray-300 rounded-md`}
    >
        <div className="uidData">
            <table
                ref={tableRef}
                className="w-full"
            >   
                <tbody> {/* Ensure to include the tbody */}
                    {data?.map((item, index) => {
                        return (
                            <tr 
                                key={index}
                                className={`w-full flex flex-column gap-3 ${
                                    index === selectedIndex ? "selected" : ""
                                }`}
                            >
                                <td 
                                    onClick={(e)=>{
                                        // console.log(data[selectedIndex]);
                                        // console.log(e.target);
                                        const selectData = data.filter((item)=>item.NumOrd == e.target.id)
                                        SubmitData(e.target.id,selectData[0]?.CodMaq,false)
                                    }}
                                    className="w-full  text-black cursor-pointer text-[18px] font-bold bg-slate-500 mb-2 px-1 text-center rounded"
                                    id={item.NumOrd}
                                    style={{
                                        userSelect: "none",
                                        backgroundColor:
                                            index === selectedIndex
                                                ? "blue"
                                                : "transparent",
                                                color: index === selectedIndex ? "white" : "black",
                                    }}
                                >
                                    {item.NumOrd} | <small className="font-semibold">{item.CodMaq}</small>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);

}

export default DialogBox;
