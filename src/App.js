/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]); //data: เก็บข้อมูลที่ดึงจาก API.
  const [countryBrands, setCountryBrands] = useState([]); //countryBrands: จัดเก็บข้อมูลยี่ห้อรถทั้งหมดตามแต่ละประเทศ (ใช้เพื่อแสดงข้อมูลเช่น "แต่ละประเทศผลิตรถกี่ยี่ห้อ และยี่ห้ออะไรบ้าง").
  const [usaBrands, setUsaBrands] = useState([]); //usaBrands: จัดเก็บข้อมูลยี่ห้อรถที่ผลิตในสหรัฐอเมริกาโดยเฉพาะ.
  const [europeBrands, setEuropeBrands] = useState([]); //europeBrands: จัดเก็บข้อมูลยี่ห้อรถที่ผลิตในประเทศยุโรป.

  useEffect(() => {
    // Get the API data
    axios
      .get(
        'https://gist.githubusercontent.com/ak1103dev/2c6c1be69300fa0717c62b9557e40e75/raw/0dc78ed8783f4c54345ee3eeac410d26805d2dbc/data.txt'
      ) //Axios GET Request: ใช้ axios.get() เพื่อดึงข้อมูลจาก API.
      .then((response) => { //ฟังก์ชันนี้จะทำงานเพื่อจัดการกับข้อมูลที่ได้รับจาก API (response)
        const apiData = response.data; // ข้อมูลที่ได้จาก API จะถูกเก็บไว้ใน response.data ซึ่งเป็นส่วนของข้อมูลที่ได้จากการตอบสนองของเซิร์ฟเวอร์
        
        
        const sliced = apiData.slice(2,-2) //ลบ 2 ตัวหน้าที่เป็น '?' ,'(' และ 2 ตัวหลัง คิอ ';' ,')'
        const apiDataObj = JSON.parse(sliced)
        setData(apiDataObj.Makes);
        // Process data
        processCarData(apiDataObj.Makes);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const processCarData = (apiData) => {
    //console.log(apiData)
    // Group brands by country
    const brandsByCountry = apiData.reduce((acc, car) => {
      const { make_country, make_display } = car; 
      if (!acc[make_country]) {
        acc[make_country] = [];
      }
      acc[make_country].push(make_display);
      return acc;
    }, {});
    console.log(brandsByCountry)
    setCountryBrands(brandsByCountry);

    // USA brands
    if (brandsByCountry['USA']) {
      setUsaBrands(brandsByCountry['USA']);
    }

    // European brands
    const europeanCountries = ['Germany', 'Italy', 'France', 'UK', 'Sweden'];
    const europeBrands = europeanCountries.reduce((acc, country) => {
      if (brandsByCountry[country]) {
        return [...acc, ...brandsByCountry[country]];
      }
      return acc;
    }, []);
    setEuropeBrands(europeBrands);
  };

  return (
    <div>
      <h1>Car Brands by Country</h1>
      
      {/* Each country and the brands they produce */}
      {Object.keys(countryBrands).map((country) => (
        <div key={country}>
          <h2>{country} produces {countryBrands[country].length} brands:</h2>
          <ul>
            {countryBrands[country].map((brand, index) => (
              <li key={index}>{brand}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* USA specific brands */}
      <h2>USA produces {usaBrands.length} brands:</h2>
      <ul>
        {usaBrands.map((brand, index) => (
          <li key={index}>{brand}</li>
        ))}
      </ul>

      {/* European brands */}
      <h2>European countries produce {europeBrands.length} brands:</h2>
      <ul>
        {europeBrands.map((brand, index) => (
          <li key={index}>{brand}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
