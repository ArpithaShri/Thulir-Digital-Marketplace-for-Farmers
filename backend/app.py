from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import os

app = Flask(__name__)
CORS(app)

# Load data
DATA_PATH = os.path.join(os.path.dirname(__file__), 'mandi_prices.csv')

def load_data():
    if not os.path.exists(DATA_PATH):
        return pd.DataFrame(columns=['date', 'crop', 'price'])
    df = pd.read_csv(DATA_PATH)
    df['date'] = pd.to_datetime(df['date'])
    return df

@app.route('/price-history', methods=['GET'])
def get_price_history():
    crop = request.args.get('crop', 'Rice').capitalize()
    df = load_data()
    crop_data = df[df['crop'] == crop].sort_values('date')
    
    if crop_data.empty:
        return jsonify({"error": "Crop not found"}), 404
    
    history = crop_data.tail(12).to_dict(orient='records')
    # Convert datetime to string for JSON
    for item in history:
        item['date'] = item['date'].strftime('%Y-%m')
        
    return jsonify(history)

@app.route('/price-predict', methods=['GET'])
def predict_price():
    crop = request.args.get('crop', 'Rice').capitalize()
    df = load_data()
    crop_data = df[df['crop'] == crop].sort_values('date')
    
    if crop_data.empty:
        return jsonify({"error": "Crop not found"}), 404
    
    # Preprocessing
    # Convert dates to numeric index (ordinal or just 0, 1, 2...)
    crop_data['month_idx'] = range(len(crop_data))
    
    X = crop_data[['month_idx']].values
    y = crop_data['price'].values
    
    # Simple Regression
    model = LinearRegression()
    model.fit(X, y)
    
    # Predict next month
    next_month_idx = np.array([[len(crop_data)]])
    prediction = model.predict(next_month_idx)[0]
    
    # Calculate trend (slope)
    slope = model.coef_[0]
    trend = "Upward" if slope > 0 else "Downward"
    
    # Calculate demand (simple logic based on recent price jump)
    recent_prices = crop_data['price'].tail(3).values
    if len(recent_prices) >= 2:
        growth = (recent_prices[-1] - recent_prices[0]) / recent_prices[0]
        demand = "High" if growth > 0.05 else "Medium"
    else:
        demand = "Medium"

    return jsonify({
        "crop": crop,
        "predicted_price": round(float(prediction), 2),
        "trend": trend,
        "demand_level": demand,
        "explanation": f"Based on {len(crop_data)} months of historical data, we observed a {trend.lower()} trend. The linear regression model projects the price based on consistent market momentum."
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
