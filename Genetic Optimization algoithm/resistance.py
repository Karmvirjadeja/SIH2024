def calculate_dynamic_resistance(wind_speed, wave_height, vessel_type, size, weight, hull_properties, monsoon, current_speed, current_direction):
    """
    Calculate dynamic wind and wave resistance for a vessel based on various factors.
    
    Parameters:
    - wind_speed (float): Wind speed in knots.
    - wave_height (float): Wave height in meters.
    - vessel_type (str): Type of the vessel (e.g., "Container Ship").
    - size (float): Vessel size (e.g., TEU for container ships).
    - weight (float): Vessel weight in tons.
    - hull_properties (dict): Hull properties such as stability factor.
    - monsoon (str): Current monsoon season ("Southwest" or "Northeast").
    - current_speed (float): Ocean current speed in knots.
    - current_direction (str): Direction of the current ("favorable", "neutral", "opposing").

    Returns:
    - wind_resistance (float): Dynamic wind resistance coefficient.
    - wave_resistance (float): Dynamic wave resistance coefficient.
    """

    # Normalize factors
    normalized_size = size / 10000  # Assume max size of 10,000 TEU
    normalized_weight = weight / 100000  # Assume max weight of 100,000 tons
    stability_factor = hull_properties.get("stability_factor", 1.0)

    # Coefficients influenced by conditions
    if monsoon == "Southwest":
        wave_factor = 0.12  # Increased wave sensitivity in Southwest Monsoon
        wind_factor = 0.06  # Slightly increased wind sensitivity
    elif monsoon == "Northeast":
        wave_factor = 0.10  # Neutral wave sensitivity
        wind_factor = 0.05  # Neutral wind sensitivity
    else:  # Intermonsoon or calm conditions
        wave_factor = 0.08  # Reduced wave sensitivity
        wind_factor = 0.04  # Reduced wind sensitivity

    # Adjust based on current direction
    if current_direction == "favorable":
        current_adjustment = -0.02
    elif current_direction == "opposing":
        current_adjustment = 0.02
    else:  # Neutral
        current_adjustment = 0.0

    # Wind Resistance Calculation
    wind_resistance = wind_factor * (wind_speed - 15) * normalized_size * stability_factor
    wind_resistance = max(0, wind_resistance)  # Ensure non-negative

    # Wave Resistance Calculation
    wave_resistance = wave_factor * (wave_height - 2) * normalized_weight * (1 + current_adjustment)
    wave_resistance = max(0, wave_resistance)  # Ensure non-negative

    return wind_resistance, wave_resistance
