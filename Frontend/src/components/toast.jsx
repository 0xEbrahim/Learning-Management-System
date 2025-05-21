import { AiFillNotification } from "react-icons/ai";
import { toast}  from "react-hot-toast";
function Toast ({t , data}){
    return(
        <div
        className={`${
          t?.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex z-50 absolute top-[60px]`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
            <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 cursor-pointer text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200">
            <AiFillNotification />
            </div>
            </div>
            <div className="ml-3 flex-1">
              {/* <p className="text-sm font-medium text-gray-900">
                revieweName
              </p> */}
              <p className="mt-1 text-sm text-gray-500">
                {data.notification?.text || data.text}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t?.id)}
            className=" cursor-pointer w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 "
          >
            close
          </button>
        </div>
      </div>
    )
}

export default Toast;