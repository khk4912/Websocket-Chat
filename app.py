from flask import *

app = Flask(__name__)


@app.route("/")
def main():
    return render_template("index.html")


app.run(host="0.0.0.0", port=80)
