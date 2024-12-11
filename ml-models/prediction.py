import uvicorn
from fastapi import FastAPI
import time
import joblib
import pandas as pd
import numpy as np
import requests
import json

# Storm Severity: Based on a combination of wind speed, wave height, and precipitation
def determine_storm_severity(row):
    severity_score = 1.5 * row['Wind_Speed_knots'] + row['Wave_Height_m'] * 2 + row['Precipitation_mm_hr'] * 0.5
    if severity_score > 100:
        return severity_score, 'High'
    elif severity_score > 55:
        return severity_score, 'Medium'
    else:
        return severity_score, 'Low'
    

app = FastAPI()

@app.get("/predict_fuel_consumption")
async def predicting(inputs: dict):

    '''
    "inputs" consists of 

    Engine_Power_kW, 
    Speed_knots, 
    Ship_Size
    Wind_Direction_degrees, 
    Wave_Direction_degrees, 
    Wind_Speed_knots, 
    Wave_Height_meters.

    '''

    Engine_Power_kW = inputs['Engine_Power_kW']
    Speed_knots = inputs['Speed_knots']
    Ship_Size = inputs['Ship_Size']
    Wind_Direction_degrees = inputs['wind_direction']
    Wave_Direction_degrees = inputs['wave_direction']
    Wind_Speed_knots = inputs['wind_speed']
    Wave_Height_meters = inputs['wave_height']

    # print(Engine_Power_kW, 
    # Speed_knots, 
    # Wind_Direction_degrees, 
    # Wave_Direction_degrees, 
    # Wind_Speed_knots, 
    # Wave_Height_meters)

    # # Prepare the numeric features for scaling
    numeric_features = [[
        Engine_Power_kW,
        Speed_knots,
        Wind_Direction_degrees,
        Wave_Direction_degrees,
        Wind_Speed_knots,
        Wave_Height_meters,
    ]]
    # # print("Numeric Features (Before Scaling):", numeric_features)

    # # Scale the numeric features using StandardScaler
    scaled_features = fuel_scaler.transform(numeric_features)
    # # print("Scaled Features:", scaled_features)

    # # Extract scaled features for the prediction
    (
        Engine_Power_kW_scaled,
        Speed_knots_scaled,
        Wind_Dir_scaled,
        Wave_Dir_scaled,
        Wind_Speed_knots_scaled,
        Wave_Height_meters_scaled,
    ) = scaled_features[0]

    # # Encode the categorical value using the OneHotEncoder
    encoded_ship_size = fuel_encoder.transform([[Ship_Size]])  # Transform the Ship_Size to encoded form
    # # print("Encoded Ship Size:", encoded_ship_size)

    # # Combine all features into a single array for prediction
    input_features = np.concatenate([
        [
            Engine_Power_kW_scaled,
            Speed_knots_scaled,
        ],
        encoded_ship_size[0],  # Append one-hot encoded ship size
        [
            Wind_Dir_scaled,
            Wave_Dir_scaled,
            Wind_Speed_knots_scaled,
            Wave_Height_meters_scaled,
        ],
        # encoded_ship_size[0]  # Append one-hot encoded ship size
    ])
    # # print("Input Features:", input_features)

    # # Ensure input is 2D by wrapping it in another list
    input_features = np.expand_dims(input_features, axis=0)  # Convert to shape (1, num_features)
    # # print("Input Features Reshaped:", input_features)

    # # Predict fuel consumption using the model
    fuel = float(fuel_model.predict(input_features)[0])  # Model expects 2D array; unpack result if needed
    print("Predicted Fuel Consumption:", fuel)

    return {"fuel": fuel}



@app.get("/predict_speed")
async def predict_speed(inputs):
    start = time.time_ns()
    # Wrap scalar values in lists
    inputs = {key: [value] for key, value in inputs.items()}
    
    # Converting JSON object into dataframe
    df = pd.DataFrame.from_dict(inputs)

    # print(df)
    
    # Select numerical features for scaling
    numerical_features = ["Fuel_Level_tonnes", "Ship_Load_%", "Wind_Speed_knots", 
                          "Precipitation_mm_hr", "Wave_Height_m", "Distance_to_Disaster_km"]
    
    # Scale numerical features
    df[numerical_features] = speed_scaler.transform(df[numerical_features])

    # Detect Storm Severity level
    df['Storm_Severity'] = df.apply(determine_storm_severity, axis=1)
    
    # Encode categorical features
    categorical_features = ["Ship_Size", "Storm_Severity"]
    encoded_data = speed_encoder.transform(df[categorical_features])
    encoded_columns = speed_encoder.get_feature_names_out(categorical_features)
    
    # Create a DataFrame from the encoded features
    encoded_df = pd.DataFrame(encoded_data, columns=encoded_columns, index=df.index)
    
    # Combine scaled numerical features and encoded categorical features
    processed_df = pd.concat([df[numerical_features], encoded_df], axis=1)
    
    # Reorder columns to match the required format
    required_columns = [
        "Fuel_Level_tonnes", "Ship_Load_%", "Wind_Speed_knots", 
        "Precipitation_mm_hr", "Wave_Height_m", "Distance_to_Disaster_km",
        "Ship_Size_Large", "Ship_Size_Medium", "Ship_Size_Small", 'Ship_Size_Very Large',
        "Storm_Severity_High", "Storm_Severity_Low", "Storm_Severity_Medium"
    ]
    processed_df = processed_df[required_columns]

    result = speed_model.predict(processed_df)
    end = time.time_ns()
    print("Total time taken : ", end-start)
    return result[0][0]

@app.get("/detect_disaster_static")
def detect_disaster(data: dict):

    '''
    "inputs" contain latitude, logitude and weather.  
    
    data = {
        "Ship_Size" : "Medium",
        "Fuel_Level_tonnes" : 53.26,
        "Ship_Load_%" : 75.0,
        "Wind_Speed_knots" : 14.95,
        "Precipitation_mm_hr" : 36.5,
        "Wave_Height_m" : 7.14,
        "Adjusted_Speed_knots" : 6.9,
    }
    
    data['Storm_Severity'] = determine_storm_severity(data['Wave_Height_m'], data['Wind_Speed_knots'], data['Precipitation_mm_hr'])

    Output:
    Model outputs the coordinate that are safe to sail with respect to weather.

    '''

    weather_json = data['weather_json']
    coordinate_json = data['coordinate_json']

    Ship_Size = "Medium",
    Fuel_Level_tonnes =  53.26,
    Ship_Load = 75.0,
    Distance_to_Disaster_km = 149.46,
    Precipitation_mm_hr = 36.5,

    return_coordinates = []
    
    print(type(Ship_Size))

    ship_sizes = {
        "Small" : {"Wind_Speed_knots": 30, "Wave_Height_m": 4},
        "Medium" : {"Wind_Speed_knots": 35, "Wave_Height_m": 6},
        "Large" : {"Wind_Speed_knots": 40, "Wave_Height_m": 7},
        "Very Large" : {"Wind_Speed_knots": 50, "Wave_Height_m": 7},
    }

    for weather, coordinate in zip(weather_json, coordinate_json):
        row = {
            'Wave_Height_m': weather['wave_height'],
            'Wind_Speed_knots': weather['wind_speed'],
            'Precipitation_mm_hr': 36.5,
        }
        # print(row)
        severity_score, severity_level = determine_storm_severity(row)

        print(severity_score, severity_level)
        # if ship_sizes[Ship_Size[0]]['Wind_Speed_knots'] > weather['wind_speed'] or \
        #     ship_sizes[Ship_Size[0]]['Wave_Height_m'] > weather['wave_height']:
            # data = {
            #     "Ship_Size" : Ship_Size,
            #     "Fuel_Level_tonnes" : Fuel_Level_tonnes,
            #     "Ship_Load_%" : Ship_Load,
            #     "Wind_Speed_knots" : weather['wind_speed'],
            #     "Precipitation_mm_hr" : weather['precipitation'],
            #     "Wave_Height_m" : weather['wave_height'],
            #     "Distance_to_Disaster_km" : 149.46,
            # }
        print("Move with full speed.")
        coordinate['severity_score'] = severity_score
        coordinate['severity_level'] = severity_level
        return_coordinates.append(coordinate)

        # else:
        #     print("Eliminating coordinate : ", coordinate['Latitude'], coordinate['Latitude'])

    with open('return_json.json', 'w') as file:
        json.dump(return_coordinates, file)
        print("File saved successfully")

    return {"coordinates_data": return_coordinates}

@app.get("/detect_disaster_dynamic")
def detect_disaster(data: dict):

    '''
    "inputs" contain latitude, logitude and weather.  
    
    data = {
        "Ship_Size" : "Medium",
        "Fuel_Level_tonnes" : 53.26,
        "Ship_Load_%" : 75.0,
        "Wind_Speed_knots" : 14.95,
        "Precipitation_mm_hr" : 36.5,
        "Wave_Height_m" : 7.14,
        "Adjusted_Speed_knots" : 6.9,
    }
    
    data['Storm_Severity'] = determine_storm_severity(data['Wave_Height_m'], data['Wind_Speed_knots'], data['Precipitation_mm_hr'])

    Output:
    Model outputs the coordinate that are safe to sail with respect to weather.

    '''

    weather_json = data['weather_json']
    coordinate_json = data['coordinate_json']

    Ship_Size = "Medium",
    Fuel_Level_tonnes =  53.26,
    Ship_Load = 75.0,
    Distance_to_Disaster_km = 149.46,
    Precipitation_mm_hr = 36.5,

    return_coordinates = []
    
    print(type(Ship_Size))

    ship_sizes = {
        "Small" : {"Wind_Speed_knots": 30, "Wave_Height_m": 4},
        "Medium" : {"Wind_Speed_knots": 35, "Wave_Height_m": 6},
        "Large" : {"Wind_Speed_knots": 40, "Wave_Height_m": 7},
        "Very Large" : {"Wind_Speed_knots": 50, "Wave_Height_m": 7},
    }

    for weather, coordinate in zip(weather_json, coordinate_json):
        row = {
            'Wave_Height_m': weather['wave_height'],
            'Wind_Speed_knots': weather['wind_speed'],
            'Precipitation_mm_hr': 36.5,
        }
        # print(row)
        severity_score, severity_level = determine_storm_severity(row)

        print(severity_score, severity_level)
        if ship_sizes[Ship_Size[0]]['Wind_Speed_knots'] < weather['wind_speed'] or \
            ship_sizes[Ship_Size[0]]['Wave_Height_m'] < weather['wave_height']:
            # data = {
            #     "Ship_Size" : Ship_Size,
            #     "Fuel_Level_tonnes" : Fuel_Level_tonnes,
            #     "Ship_Load_%" : Ship_Load,
            #     "Wind_Speed_knots" : weather['wind_speed'],
            #     "Precipitation_mm_hr" : weather['precipitation'],
            #     "Wave_Height_m" : weather['wave_height'],
            #     "Distance_to_Disaster_km" : 149.46,
            # }
            print("Move with full speed.")
            coordinate['severity_score'] = severity_score
            coordinate['severity_level'] = severity_level
            return_coordinates.append(coordinate)
            print("Eliminating coordinate : ", coordinate['Latitude'], coordinate['Latitude'])

        else:
            print("Safe Coordinates : ", coordinate['Latitude'], coordinate['Latitude'])

    with open('return_json.json', 'w') as file:
        json.dump(return_coordinates, file)
        print("File saved successfully")

    return {"coordinates_data": return_coordinates}
    

if __name__ == "__main__":
    
    # Load the pipeline from the file for Speed
    loaded_pipeline = joblib.load('ship_speed_pipeline.pkl')

    # Extract components
    speed_scaler = loaded_pipeline['scaler']
    speed_encoder = loaded_pipeline['encoder']
    speed_model = loaded_pipeline['model']

    # Load the pipeline from the file for Fuel
    loaded_pipeline = joblib.load('ship_fuel_consumption.pkl')

    # Extract components
    fuel_scaler = loaded_pipeline['scaler']
    fuel_encoder = loaded_pipeline['encoder']
    fuel_model = loaded_pipeline['model']   

    print("Pipeline loaded successfully")
    
    uvicorn.run(app, host="0.0.0.0", port=8080)