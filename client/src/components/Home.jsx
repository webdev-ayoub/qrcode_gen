import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function Home() {

    const [titleField, setTitle] = useState("");
    const [linkField, setLink] = useState("");
    const [qrCodes, setQrcode] = useState();
    const [qrField, setList] = useState("")

    const sendReq = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api",
                {
                    qr_title: titleField,
                    qr_url: linkField
                }
            );
            if (response.data.message === "Done") {
                let image = "http://localhost:5173/assets/" + titleField + '.png';
                Swal.fire({
                    imageUrl: image,
                    imageHeight: 250,
                    imageWidth: 250,
                    showConfirmButton: false
                })
            }
            console.log(response);
        } catch (error) { console.log(error); }
    }

    useEffect(() => {
        const fetchImageTitles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/qr_titles');
                setQrcode(response.data.titles);
            } catch (error) {
                console.log('Error fetching image titles:', error);
            }
        };
        setInterval(fetchImageTitles, 1200);
    }, []);

    for (var i = 0; i < qrCodes?.length; i++) {
        if (qrCodes[i] === qrField) {
            let qr_image = "http://localhost:5173/assets/" + qrField + '.png';
            Swal.fire({
                imageUrl: qr_image,
                imageHeight: 250,
                imageWidth: 250,
                showConfirmButton: false
            });
            setList("");
            break;
        }
    }

    return (
        <div className="container">
            <div className="bg-dark shadow p-3 rounded">
                <form className="d-flex gap-2 flex-column" onSubmit={sendReq} >
                    <div className="form-group mb-3">
                        <input
                            type="text"
                            name="qr_title"
                            value={titleField}
                            onChange={(e) => setTitle(e.target.value)}
                            className="form-control text-center"
                            placeholder="Title"
                            autoFocus
                        />
                    </div>
                    <div className="form-group mb-3">
                        <input
                            name="qr_url"
                            type="text"
                            value={linkField}
                            onChange={(e) => setLink(e.target.value)}
                            className="form-control text-center"
                            placeholder="Link"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-auto mx-auto text-uppercase"
                    >generate</button>
                    <select
                        className="form-select"
                        value={qrField}
                        onChange={e => setList(e.target.value)}
                    >
                        <option key={Date.now()} value="0">Get your QrCodes</option>
                        {qrCodes && qrCodes.map((qrcode, index) => {
                            return (
                                <option key={index} value={qrcode}>{qrcode}</option>
                            )
                        })}
                    </select>
                </form>
            </div>
        </div>
    )
}

export default Home;