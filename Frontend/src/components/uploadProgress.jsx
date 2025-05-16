function UploadProgress({progress}){

    return(
        <div className=" w-full bg-[#eee] top-0 left-0 rounded-md h-[8px] mb-6 ">
            <div className={`bg-indigo-600 h-full rounded-sm`} style={{width:`${progress}%`}} ></div>
        </div>
    )
}

export default UploadProgress;