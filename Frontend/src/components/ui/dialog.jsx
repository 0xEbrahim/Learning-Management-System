import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { useState , useEffect } from "react"
import api from "../../axiosInstance"
import { useParams } from "react-router-dom"
import { cn } from "../../lib/utils"
import { CiStar } from "react-icons/ci"
import Swal from "sweetalert2"
import Loading from "../loading"

function Dialog({
  ...props
}) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
  className,
  ...props
}) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" className="flex flex-start cursor-pointer ms-4" {...props} />;
}

function DialogPortal({
  ...props
}) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
  ...props
}) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props} />
  );
}

function DialogContent({
  className,
  children,
  ...props
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}>
        {children}
        <DialogPrimitive.Close
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props} />
  );
}

function DialogFooter({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props} />
  );
}

function DialogTitle({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold mb-5", className)}
      {...props} />
  );
}

function DialogDescription({
  className,
  reviewId
}) {
  const {courseId}=useParams();
  const [rating,setRating]=useState("");
  const[review,setReview]=useState("");
  const [hover,setHover]=useState();

  useEffect(()=>{

    const getReviewById=async()=>{
      try{
        const res=await api.get(`courses/${courseId}/reviews/${reviewId}`);
        setRating(res.data.data.review.rating);
        setReview(res.data.data.review.review);
      }catch(error){
        return;
      }
    }

    getReviewById();
  },[])
  
  const handleReviewChange=(value)=>{
    setReview(value);
  }
  
  const updateReview=async()=>{

    try{
      const res= await api.patch(`courses/${courseId}/reviews/${reviewId}`,{
        rating:rating,
        review:review
      });

      if(res.status === 200){
        Swal.fire({
          title: "review has been updated successfully",
          icon: "success",
        }).then(()=>{
          window.location.reload();
        });
      }
    }catch(error){
      console.log(error);
    }
  }

  return (
      <>
        {!rating ? <Loading/> :<>
                                    <DialogPrimitive.Description
                                    data-slot="dialog-description"
                                    className={cn("text-muted-foreground text-sm", className)}
                                    />
                                <p className="text-gray-600 text-start">score:</p>
                                <div className="rating flex items-center mb-3 text-start">
                                {[...Array(5)].map((_, index) => {
                                    const value = index + 1;
                                    return (
                                        <button
                                          key={value}
                                          onClick={() => setRating(value)}
                                          onMouseEnter={() => setHover(value)}
                                          onMouseLeave={() => setHover(0)}
                                          className="focus:outline-none"
                                        >
                                          <CiStar
                                            className={`text-3xl transition-colors ${
                                              value <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                          />
                                        </button>
                                      );
                                })}
                                </div>
                                <form onSubmit={(e)=>{e.preventDefault()}} className="text-start">
                                    <label className="block text-gray-600 mb-1">review:</label>
                                    <input value={review} className="outline-none caret-indigo-600 mb-4" onChange={(e)=>{handleReviewChange(e.target.value)}} />
                                    <button onClick={()=>{updateReview()}} className=" text-center block w-full text-white bg-indigo-600 rounded-sm px-1.5 py-1 text-sm font-[500] cursor-pointer">Update</button>
                                </form>
                              </> }
      </>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
