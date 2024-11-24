import math

def calculate_thresholds(vessel_type, size, weight, hull_design, monsoon, current_speed, current_direction):
    """
    Calculate optimal wind speed and wave height thresholds for vessel operation.
    
    Args:
        vessel_type (str): Type of the vessel (e.g., "Container Ship", "Bulk Carrier").
        size (float): Size of the vessel in TEU or DWT.
        weight (float): Weight of the vessel in tons.
        hull_design (dict): Hull properties (e.g., stability_factor).
        monsoon (str): Current monsoon season ("Northeast", "Southwest", "None").
        current_speed (float): Speed of the ocean current in knots.
        current_direction (str): Direction of the ocean current ("favorable", "neutral", "opposing").
    
    Returns:
        tuple: Wind speed threshold (knots), wave height threshold (meters).
    """

    # Base thresholds for a typical vessel in neutral conditions
    BASE_WIND_THRESHOLD = 15  # knots
    BASE_WAVE_THRESHOLD = 2  # meters

    # Vessel-specific adjustment factors
    VESSEL_FACTORS = {
        "Container Ship": 1.1,
        "Bulk Carrier": 1.2,
        "Cargo Ship": 1.0,
        "Tanker": 1.3,
    }

    # Default vessel factor if type is not explicitly listed
    vessel_factor = VESSEL_FACTORS.get(vessel_type, 1.0)

    # Calculate size and weight adjustments
    size_factor = math.log(max(size, 1)) / 10  # Avoid log(0); larger size improves thresholds
    weight_factor = math.sqrt(max(weight, 1)) / 1000  # Avoid sqrt(0); heavier ships resist better

    # Hull design factor (default to 1.0 if not provided)
    hull_factor = hull_design.get("stability_factor", 1.0)

    # Environmental adjustments for monsoon effects
    MONSOON_FACTORS = {
        "Northeast": {"wind": -1, "wave": 0.2},
        "Southwest": {"wind": -3, "wave": 0.5},
        "None": {"wind": 0, "wave": 0},
    }
    monsoon_adjustment = MONSOON_FACTORS.get(monsoon, {"wind": 0, "wave": 0})

    # Environmental adjustments for current direction
    CURRENT_FACTORS = {
        "favorable": {"wind": 1, "wave": -0.1},
        "neutral": {"wind": 0, "wave": 0},
        "opposing": {"wind": -2, "wave": 0.3},
    }
    current_adjustment = CURRENT_FACTORS.get(current_direction, {"wind": 0, "wave": 0})

    # Compute thresholds with all factors considered
    wind_threshold = (
        BASE_WIND_THRESHOLD
        + vessel_factor * (size_factor + weight_factor + hull_factor)
        + monsoon_adjustment["wind"]
        + current_adjustment["wind"]
    )
    wave_threshold = (
        BASE_WAVE_THRESHOLD
        + vessel_factor * (size_factor + hull_factor)
        + monsoon_adjustment["wave"]
        + current_adjustment["wave"]
    )

    # Constrain thresholds to realistic operational ranges
    wind_threshold = max(10, min(30, wind_threshold))  # Wind: 10-30 knots
    wave_threshold = max(0.5, min(5, wave_threshold))  # Wave: 0.5-5 meters

    # Return rounded thresholds for clarity
    return round(wind_threshold, 2), round(wave_threshold, 2)


# Example Usage
if __name__ == "__main__":
    hull_properties = {"stability_factor": 1.2}
    vessel_type = "Container Ship"
    size = 5000  # TEU for container ships
    weight = 70000  # Tons
    monsoon = "Southwest"
    current_speed = 2.0  # Knots
    current_direction = "opposing"

    wind_threshold, wave_threshold = calculate_thresholds(
        vessel_type, size, weight, hull_properties, monsoon, current_speed, current_direction
    )

    print(f"Calculated Wind Speed Threshold: {wind_threshold} knots")
    print(f"Calculated Wave Height Threshold: {wave_threshold} meters")


