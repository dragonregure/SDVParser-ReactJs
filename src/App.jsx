import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [result, setResult] = useState("")
  const [base, setBase] = useState("");
  const [translation, setTranslation] = useState("");
  const [type, setType] = useState("map");
  const [entity, setEntity] = useState("Objects");
  const [unmapped, setUnmapped] = useState("");
  const [leftover, setLeftover] = useState("");

  const handleChange = (event) => {
    let id = event.target.id;
    let functionName = setBase;
    if (id === "Translation") {
      functionName = setTranslation;
    }
    functionName(event.target.value);
  }

  const handleProcess = () => {
    setResult("Loading");
    makeApiCall();
  }

  const handleTypeChange = (event) => {
    setType(event.target.value);
  }

  const handleEntityChange = (event) => {
    setEntity(event.target.value);
  }

  const makeApiCall = async () => {
    await fetch("http://127.0.0.1:8000/api/v1/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        base: base,
        translation: translation,
        type: type,
        entity: type === "convert" ? entity : "",
      }),
    })
    .then((res) => res.json())
    .then((data) => {
        setResult(data.result);
        setUnmapped(data.unmapped);
        setLeftover(data.leftover);
    })
    .catch((err) => console.log(err));
  }

  return (
    <>
      <div>
        <span className='text'>
          <textarea id='Base' placeholder='Base' value={base} onChange={handleChange}></textarea>
        </span>
        <span className='text'>
          <textarea id='Translation' placeholder='Translation' value={translation} onChange={handleChange}></textarea>
        </span>
      </div>
      <div>
        <input type="radio" name="processType" value="map" onChange={handleTypeChange} defaultChecked/> Map
        <input type="radio" name="processType" value="convert" onChange={handleTypeChange}/> Convert
        <input type="radio" name="processType" value="merge" onChange={handleTypeChange}/> Merge
        <input type="radio" name="processType" value="mergeFinished" onChange={handleTypeChange}/> Merge Finished
        <input type="radio" name="processType" value="test" onChange={handleTypeChange}/> Test
      </div>
      {type == "convert" && (
        <div>
          <input type="radio" name="processEntity" value="Objects" onChange={handleEntityChange} defaultChecked/> Objects
          <input type="radio" name="processEntity" value="Weapons" onChange={handleEntityChange}/> Weapons
        </div>
      )}
      {type == "merge" && (
        <div>
          <h2>Instruction</h2>
          <ol>
            <li>Copy folder Content(Lama) dan Content(Baru) ke /storage/app/public/sdv</li>
            <li>Isi text area "Base" dengan nama folder Content(Baru)</li>
            <li>Isi text area "Translation" dengan nama folder Content(Lama)</li>
            <li>Klik process</li>
            <li>Akan muncul 2 folder baru yaitu "Result" dan "Unfinished"</li>
            <li>Folder Result adalah hasil merge, translasi dari folder Content(Lama) akan di map ke file2 Content(Baru)</li>
            <li>Folder Unfinished berisi file dan line yang belum di translasi dari Content(Baru)</li>
          </ol>
        </div>
      )}
      {type == "mergeFinished" && (
        <div>
          <h2>Instruction</h2>
          <ol>
            <li>Setelah meng-translasi file2 pada folder Unfinished, save data2 tersebut dengan nama folder Finished</li>
            <li>Simpan folder Finished ke /storage/app/public/sdv</li>
            <li>Isi text area "Base" dengan nama folder Result</li>
            <li>Isi text area "Translation" dengan nama folder Finished</li>
            <li>Klik process</li>
            <li>Akan muncul 1 folder baru yaitu "FinishedResult"</li>
            <li>Folder FinishedResult adalah hasil akhir, dimana file2 dari update terbaru sudah ditranslate</li>
          </ol>
        </div>
      )}
      <div className="card">
        <button onClick={handleProcess}>
          Process
        </button>
        <button onClick={() => {
          setResult("");
          setUnmapped("");
          setLeftover("");
          setBase("");
          setTranslation("");
        }}>Reset</button>
      </div>
      <div>
        <h2>Result</h2>
        <span className='text'>{result}</span>
      </div>
      <div>
        <h2>Unmapped</h2>
        <span className='text'>{unmapped}</span>
      </div>
      <div>
        <h2>Leftover</h2>
        <span className='text'>{leftover}</span>
      </div>
    </>
  )
}

export default App
