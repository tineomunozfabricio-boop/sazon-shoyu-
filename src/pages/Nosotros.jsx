import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "./Nosotros.css";
import Nosotros1 from '../Imagenes/Nosotros1.jpeg'
import Nosotros2 from '../Imagenes/Nosotros2.jpeg'
export default function Nosotros() {
  return (
    <div className="page">
      <Navbar />

      <section className="story container">
        <div className="story__image">
          <img
            src={Nosotros1}
            alt="Atardecer en el litoral del Pacífico"
          />
        </div>
        <div className="story__copy">
          <p className="eyebrow">Nuestra historia</p>
          <h1 className="story__title">
            Donde el Pacífico
            <br />
            encuentra el <span className="accent-italic">Ande</span>
          </h1>
          <p className="story__text">
            Sazón &amp; Shoyu nació en 2018 de la amistad entre un chef
            criollo en Miraflores y una cocinera japonesa que llegó a Lima
            enamorada del ceviche. Lo que empezó como experimento en una
            cocina pequeña se convirtió en el restaurante que hoy somos.
          </p>
          <p className="story__text">
            Creemos que la cocina nikkei no es fusión forzada — es el
            resultado natural de siglos de convivencia entre dos culturas que
            comparten el respeto por los ingredientes frescos, la precisión en
            la técnica y la alegría de la mesa compartida.
          </p>
        </div>
      </section>

      <section className="chefs container">
        <div className="chefs__copy">
          <p className="eyebrow">Chef</p>
          <h2 className="chefs__title">
            Carlos Mendoza
            <br />
            <span className="accent-italic">&amp;</span> Yuki Tanaka
          </h2>
          <p className="chefs__text">
            Carlos estudió en Le Cordon Bleu Lima y perfeccionó su técnica en
            Osaka durante tres años. Yuki nació en Kyoto y llegó a Perú para
            enseñar gastronomía nikkei. Se conocieron por accidente
            inevitable.
          </p>
          <p className="chefs__text">
            Juntos han creado una propuesta donde el otoño y el sabimi
            conviven, donde el miso y el ají amarillo se entienden, y donde
            cada visita es un viaje entre dos mundos que hoy son uno solo.
          </p>
        </div>
        <div className="chefs__image">
          <img
            src={Nosotros2}
            alt="Los chefs Carlos Mendoza y Yuki Tanaka"
          />
        </div>
      </section>

      <section className="values container">
        <div className="values__card">
          <h3 className="values__heading">Nuestra Misión</h3>
          <p className="values__text">
            Ofrecer una experiencia gastronómica fielmente nutrida,
            combinando la creatividad y el respeto por las tradiciones
            culinarias del Perú y Japón.
          </p>
        </div>
        <div className="values__card">
          <h3 className="values__heading">Nuestra Visión</h3>
          <p className="values__text">
            Ser reconocidos como un referente de la cocina nikkei, elevando
            nuestros estándares e innovación y compromiso con la satisfacción
            de nuestros clientes.
          </p>
        </div>
        <div className="values__card">
          <h3 className="values__heading">Nuestros Valores</h3>
          <ul className="values__list">
            <li>Autenticidad: Respetamos la esencia de las culturas que
              nos inspiran, sazón auténtica.</li>
            <li>Pasión: Seleccionamos ingredientes de lo más alta calidad
              para cada preparación.</li>
            <li>Innovación: Creamos nuevos caminos manteniendo el
              respeto por lo esencial.</li>
            <li>Hospitalidad: Brindamos una atención cálida y
              personalizada.</li>
            <li>Gratitud y Equilibrio: Honramos lo aprendido de
              nuestras raíces en cada detalle.</li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
