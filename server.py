from flask import Flask, request, jsonify
import scraper

app = Flask(__name__)

@app.route('/', methods=['GET'])
def getData():
    #content = request.json
    #results = scraper.getData(content['University'], content['Professor'])
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
