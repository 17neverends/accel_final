import { useState, useEffect } from 'react';
import { Loader, Carousel, Tabs } from 'rsuite';
import { getHarvesters } from '../../api/harvester';
import { Harvester } from '../../interfaces/harvester';
import InputField from '../configInput/configInput';
import styles from './config.module.css';


const Config = () => {
  const [combines, setCombines] = useState<Harvester[]>([]);
  const [filteredCombines, setFilteredCombines] = useState<Harvester[]>([]);
  const [selectedCombine, setSelectedCombine] = useState<Harvester | null>(null);
  const [selectedType, setSelectedType] = useState<string>('Зерноуборочный');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [humidity, setHumidity] = useState<string>('');
  const [volume, setVolume] = useState<string>('');
  const [bulk, setBulk] = useState<string>('');
  const [fullness, setFullness] = useState<string>('');
  const [carouselShadow, setCarouselShadow] = useState<string>('transparent');

  useEffect(() => {
    if (selectedType === 'Зерноуборочный') {
      setBulk('800');
    } else if (selectedType === 'Кормоуборочный') {
      setBulk('600');
    }
  }, [selectedType]);

  useEffect(() => {
    if (volume && humidity && bulk) {
      const calculatedFullness = (parseFloat(volume) * parseFloat(humidity) * 0.01 * parseFloat(bulk)).toFixed(2);
      setFullness(calculatedFullness);
    }
  }, [volume, humidity, bulk]);

  useEffect(() => {
    const fetchCombines = async () => {
      const response = await getHarvesters();
      setCombines(response);
      const initialTypeCombines = response.filter((combine: { type: string }) => combine.type === 'Зерноуборочный');
      setFilteredCombines(initialTypeCombines);
      setSelectedCombine(initialTypeCombines[0]);
      setCurrentIndex(0);
    };

    fetchCombines();
  }, []);

  useEffect(() => {
    const filtered = combines.filter(combine => combine.type === selectedType);
    setFilteredCombines(filtered);
    setSelectedCombine(filtered[0]);
    setCurrentIndex(0);
  }, [selectedType, combines]);

  useEffect(() => {
    if (selectedCombine && selectedCombine.photo_url) {
      const img = new Image();
      img.src = selectedCombine.photo_url;
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = img.width;
        canvas.height = img.height;

        ctx?.drawImage(img, 0, 0);

        const topLeft = ctx?.getImageData(0, 0, 1, 1).data;
        const topRight = ctx?.getImageData(img.width - 1, 0, 1, 1).data;
        const bottomLeft = ctx?.getImageData(0, img.height - 1, 1, 1).data;
        const bottomRight = ctx?.getImageData(img.width - 1, img.height - 1, 1, 1).data;

        if (topLeft && topRight && bottomLeft && bottomRight) {
          const shadowTopLeft = `rgba(${topLeft[0]}, ${topLeft[1]}, ${topLeft[2]}, ${topLeft[3] / 255})`;
          const shadowTopRight = `rgba(${topRight[0]}, ${topRight[1]}, ${topRight[2]}, ${topRight[3] / 255})`;
          const shadowBottomLeft = `rgba(${bottomLeft[0]}, ${bottomLeft[1]}, ${bottomLeft[2]}, ${bottomLeft[3] / 255})`;
          const shadowBottomRight = `rgba(${bottomRight[0]}, ${bottomRight[1]}, ${bottomRight[2]}, ${bottomRight[3] / 255})`;

          setCarouselShadow(`
            ${shadowTopLeft} 0px 4px 10px, 
            ${shadowTopRight} 0px 4px 10px, 
            ${shadowBottomLeft} 0px 4px 10px, 
            ${shadowBottomRight} 0px 4px 10px
          `);
        }
      };
    }
  }, [selectedCombine]);

  if (!selectedCombine) {
    return <Loader size="lg" content="Загрузка..." />;
  }

  const handleSelectFromCarousel = (index: number) => {
    setCurrentIndex(index);
    setSelectedCombine(filteredCombines[index]);
  };

  return (
    <div style={{ padding: '10px' }}>
      <Tabs
        appearance="subtle"
        activeKey={selectedType}
        onSelect={key => setSelectedType(key as string)}
        style={{ marginBottom: '20px', textAlign: 'center', marginLeft: '17rem', marginRight: '17rem' }}
      >
        <Tabs.Tab eventKey="Зерноуборочный" title="Зерноуборочный" />
        <Tabs.Tab eventKey="Кормоуборочный" title="Кормоуборочный" />
      </Tabs>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Carousel
          shape="bar"
          style={{
            borderRadius: '1rem',
            width: '40%',
            boxShadow: carouselShadow,
            transition: 'box-shadow 0.3s ease',
          }}
          activeIndex={currentIndex}
          onSelect={handleSelectFromCarousel}
        >
          {filteredCombines.map((combine, index) => (
            <img
              src={combine.photo_url}
              key={index}
              alt={combine.name}
              style={{
                cursor: 'pointer',
              }}
            />
          ))}
        </Carousel>
        <div style={{ width: '55%' }}>
          <h3 style={{ textAlign: 'center' }}>{selectedCombine.type} комбайн {selectedCombine.name}</h3>
          <p style={{ marginBottom: '2rem', marginTop: '2rem', textAlign: 'center' }}>{selectedCombine.description}</p>
          <h5 style={{ marginBottom: '1rem', textAlign: 'center' }}>Производительность: {selectedCombine.access_point} кг/сек</h5>
          <div className={styles.inputs}>
            <div className={styles.stackInputs}>
              <InputField
                value={humidity}
                onChange={setHumidity}
                label="Влажность (%)"
                placeholder="Влажность (%)"
              />
              <InputField
                value={volume}
                onChange={setVolume}
                label="Объем кузова (м3)"
                placeholder="Объем кузова (м3)"
              />
            </div>
            <div className={styles.stackInputs}>
              <InputField
                value={bulk}
                onChange={setBulk}
                label="Наспыная плотность"
                placeholder="Наспыная плотность"
              />
              <InputField
                value={fullness}
                onChange={setFullness}
                label="Вместимость (кг)"
                placeholder="Вместимость (кг)"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Config;
