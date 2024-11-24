import React from 'react';
import Header from "../components/Header";
import ProgressBar from '../components/ProgressBar';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.jpg';
import img6 from '../assets/img6.jpg';
import img7 from '../assets/img7.jpg';
import img8 from '../assets/img8.jpg';
import img9 from '../assets/img9.jpg';
import img10 from '../assets/img10.jpg';

const OptimzePath = () => {
    return (
      <>
        <div>
          <Header />
          <ProgressBar currentStep={6} />
        </div>

        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold text-center mb-8">TrailQuester</h1>

          {/* Grid layout with consistent image sizes */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <img src={img2} alt="Image 1" className="w-full h-48 object-fit rounded-lg shadow-lg" />
              <p className="mt-2 text-lg font-semibold"></p>
            </div>

            <div className="text-center">
              <img src={img3} alt="Image 2" className="w-full h-50 object-fit rounded-lg shadow-lg" />
              <p className="mt-2 text-lg font-semibold"></p>
            </div>

            <div className="text-center">
              <img src={img4} alt="Image 3" className="w-full h-50 object-fit rounded-lg shadow-lg" />
              <p className="mt-2 text-lg font-semibold"></p>
            </div>

            <div className="text-center">
              <img src={img5} alt="Image 4" className="w-full h-50 object-fit rounded-lg shadow-lg" />
              <p className="mt-2 text-lg font-semibold"></p>
            </div>

            <div className="text-center">
              <img src={img6} alt="Image 5" className="w-full h-50 object-fit rounded-lg shadow-lg" />
              <p className="mt-2 text-lg font-semibold"></p>
            </div>

            <div className="text-center">
              <img src={img7} alt="Image 6" className="w-full h-50 object-fit rounded-lg shadow-lg" />
              <p className="mt-2 text-lg font-semibold"></p>
            </div>

            <div className="text-center">
              <img src={img8} alt="Image 7" className="w-full h-50 object-fit rounded-lg shadow-lg" />
              <p className="mt-2 text-lg font-semibold"></p>
            </div>

            <div className="text-center">
              <img src={img9} alt="Image 8" className="w-full h-50 object-fit rounded-lg shadow-lg" />
              <p className="mt-2 text-lg font-semibold"></p>
            </div>

            <div className="text-center">
              <img src={img10} alt="Image 9" className="w-full h-50 object-fit rounded-lg shadow-lg" />
              <p className="mt-2 text-lg font-semibold"></p>
            </div>
          </div>
        </div>
      </>
    );
}

export default OptimzePath;
