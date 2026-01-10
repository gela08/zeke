import "../styles/pages/Letter.css";
// import { AuroraText } from "../components/ui/aurora-text";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "../components/ui/draggable-card";

type GalleryItem = {
  title: string;
  image: string;
  className: string;
};

export default function Letter() {
  const items: GalleryItem[] = [
    { 
      title: "", 
      image: "gallery-20.webp", 
      className: "card card-1" 
    },
    { 
      title: "", 
      image: "gallery-16.webp", 
      className: "card card-2" 
    },
    { 
      title: "", 
      image: "gallery-5.webp", 
      className: "card card-3" 
    },
    { 
      title: "", 
      image: "gallery-11.webp", 
      className: "card card-4" 
    },
    { 
      title: "", 
      image: "gallery-12.webp", 
      className: "card card-5" 
    },
    { 
      title: "", 
      image: "gallery-7.webp", 
      className: "card card-6" 
    },
    { 
      title: "", 
      image: "gallery-17.webp", 
      className: "card card-7" 
    },
    { 
      title: "", 
      image: "gallery-18.webp", 
      className: "card card-8" 
    },
    { 
      title: "", 
      image: "gallery-23.webp", 
      className: "card card-9" 
    },
    { 
      title: "", 
      image: "gallery-22.webp", 
      className: "card card-10" 
    },
    { 
      title: "", 
      image: "impression-journal.webp", 
      className: "card card-11" 
    },
  ];

  return (
    <section className="letter-section">
      <DraggableCardContainer className="letter-container">
        <p className="letter-text">
          {/* <AuroraText colors={["#FF0080", "#7928CA", "#0070F3", "#38bdf8"]}>
            I love you
            <br />
            Cebu ug Bohol!
          </AuroraText> */}
          I Love You So Much, 
          <br />
          My Zeke
        </p>

        {items.map((item, index) => (
          <DraggableCardBody key={index} className={item.className}>
            <img
              src={item.image}
              alt={item.title}
              className="letter-image"
            />
            {item.title && (
              <h3 className="letter-title">{item.title}</h3>
            )}
          </DraggableCardBody>
        ))}
      </DraggableCardContainer>
    </section>
  );
}
