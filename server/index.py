from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from pathlib import Path
import qrcode

app = Flask(__name__)
CORS(app)


@app.route("/")
@cross_origin()
def home():
    return "QR Code Generator"


@app.route("/api", methods=["POST"])
@cross_origin()
def generate():
    try:
        with open("qrcode_titles.txt", "a") as f:
            if request.method == "POST":
                data = request.json
                qr_title = data.get("qr_title")
                qr_url = data.get("qr_url")
                qr = qrcode.make(qr_url)
                qr.save(Path(__file__).parent.parent / "client/public/assets" / str(qr_title + ".png"))
                f.write(str(qr_title))
                f.write("\n")
                return jsonify({"message": "Done"})

    except Exception as error:
        return "Error: " + str(error)


@app.route("/qr_titles", methods=["GET"])
@cross_origin()
def fetchQr():
    try:
        with open("qrcode_titles.txt") as file2:
            lst = []
            lines = file2.readlines()
            for line in lines:
                lst.append(str(line.replace("\n", "")))
            return jsonify({"titles": lst})

    except Exception as error:
        return "Error: " + str(error)


if __name__ == "__main__":
    app.run(debug=True)
