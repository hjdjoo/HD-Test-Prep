import { useEffect, Dispatch, SetStateAction } from "react";

interface QuestionImageProps {
  imageUrl: string
  imageLoaded: boolean
  setImageLoaded: Dispatch<SetStateAction<boolean>>
}

export default function QuestionImage(props: QuestionImageProps) {

  const { imageUrl, imageLoaded, setImageLoaded } = props;

  useEffect(() => {

    async function prefetch() {

      if (imageUrl) {
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => setImageLoaded(true);
        img.onerror = () => {
          console.error("image loading failed");
          setImageLoaded(false);
        }
      }
    }

    prefetch();

  }, [imageUrl])

  return (

    <div>
      {imageLoaded &&
        <img src={imageUrl} alt="question image" />
      }
    </div>

  )
}