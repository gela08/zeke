import "../styles/pages/Letter.css";
// import { AuroraText } from "../components/ui/aurora-text";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "../components/ui/draggable-card";

type GalleryItem = {
  title: string;
  subtitle: string;
  description: string;
  // image: string;
  className: string;
};

type GalleryItemTwo = {
  title: string;
  subtitle: string;
  description: string;
  // image: string;
  className: string;
};

export default function Letter() {
  const items: GalleryItem[] = [
    {
      title: "Top 1",
      subtitle: "",
      description: "Cutie you is sleeping and woke up around 1am just to say you love me, one of the most sweetest lines you're ever said.",
      // description: "",
      // image: "gallery-20.webp", 
      className: "card card-1"
    },
    {
      title: "Top 2",
      subtitle: "",
      description: "",
      // image: "gallery-16.webp", 
      className: "card card-2"
    },
    {
      title: "Top 3",
      subtitle: "",
      description: "",
      // image: "gallery-5.webp", 
      className: "card card-3"
    },
    {
      title: "Top 4",
      subtitle: "",
      description: "",
      // image: "gallery-11.webp", 
      className: "card card-4"
    },
    {
      title: "Top 5",
      subtitle: "",
      description: "",
      // image: "gallery-12.webp", 
      className: "card card-5"
    },
    {
      title: "Top 6",
      subtitle: "",
      description: "",
      // image: "gallery-7.webp", 
      className: "card card-6"
    },
    {
      title: "Top 7",
      subtitle: "",
      description: "",
      // image: "gallery-17.webp", 
      className: "card card-7"
    },
    {
      title: "Top 8",
      subtitle: "",
      description: "",
      // image: "gallery-18.webp", 
      className: "card card-8"
    },
    {
      title: "Top 9",
      subtitle: "",
      description: "",
      // image: "gallery-23.webp", 
      className: "card card-9"
    },
    {
      title: "Top 10",
      subtitle: "",
      description: "",
      // image: "gallery-22.webp", 
      className: "card card-10"
    },
    {
      title: "Top 11",
      subtitle: "",
      description: "",
      // image: "gallery-22.webp", 
      className: "card card-11"
    },
  ];

  const itemsTwo: GalleryItemTwo[] = [
    {
      title: "Top 12",
      subtitle: "",
      description: "",
      // image: "gallery-20.webp", 
      className: "card card-12"
    },
    {
      title: "Top 13",
      subtitle: "",
      description: "",
      // image: "gallery-16.webp", 
      className: "card card-13"
    },
    {
      title: "Top 14",
      subtitle: "",
      description: "",
      // image: "gallery-5.webp", 
      className: "card card-14"
    },
    {
      title: "Top 15",
      subtitle: "",
      description: "",
      // image: "gallery-11.webp", 
      className: "card card-15"
    },
    {
      title: "Top 16",
      subtitle: "",
      description: "",
      // image: "gallery-12.webp", 
      className: "card card-16"
    },
    {
      title: "Top 17",
      subtitle: "",
      description: "",
      // image: "gallery-7.webp", 
      className: "card card-17"
    },
    {
      title: "Top 18",
      subtitle: "",
      description: "",
      // image: "gallery-17.webp", 
      className: "card card-18"
    },
    {
      title: "Top 19",
      subtitle: "",
      description: "",
      // image: "gallery-18.webp", 
      className: "card card-19"
    },
    {
      title: "Top 20",
      subtitle: "",
      description: "",
      // image: "gallery-23.webp", 
      className: "card card-20"
    },
    {
      title: "Top 21",
      subtitle: "",
      description: "",
      // image: "gallery-22.webp", 
      className: "card card-21"
    },
    {
      title: "Top 22",
      subtitle: "",
      description: "",
      // image: "gallery-22.webp", 
      className: "card card-22"
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
            {/* <img
              // src={item.image}
              alt={item.title}
              // className="letter-image"
            /> */}
            {item.title && (<div className="letter-card-td">
              <h3 className="letter-title">{item.title}</h3>
              <p className="letter-description">{item.description}</p>
            </div>

            )}
          </DraggableCardBody>
        ))}

        {/* itemsTwo */}
        {itemsTwo.map((item, index) => (
          <DraggableCardBody key={`two-${index}`} className={item.className}>
            {item.title && (<div className="letter-card-td">
              <h3 className="letter-title">{item.title}</h3>
              <p className="letter-description">{item.description}</p>
            </div>
            )}
          </DraggableCardBody>
        ))}


      </DraggableCardContainer>
    </section>
  );
}
