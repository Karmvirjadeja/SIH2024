import math

def generate_intermediate_coordinates(start_lat, start_lon, end_lat, end_lon, num_points=5):
    """
    Generate intermediate latitude and longitude points between two coordinates.

    Parameters:
    start_lat, start_lon: Latitude and longitude of the starting point (in degrees)
    end_lat, end_lon: Latitude and longitude of the ending point (in degrees)
    num_points: Number of intermediate points to generate (default: 10)

    Returns:
    A list of tuples with intermediate latitude and longitude points.
    """
    # Convert degrees to radians
    start_lat, start_lon = map(math.radians, [start_lat, start_lon])
    end_lat, end_lon = map(math.radians, [end_lat, end_lon])

    # Calculate the great-circle distance (angular distance)
    delta_lon = end_lon - start_lon
    a = (math.cos(end_lat) * math.sin(delta_lon)) ** 2 + \
        (math.cos(start_lat) * math.sin(end_lat) - 
         math.sin(start_lat) * math.cos(end_lat) * math.cos(delta_lon)) ** 2
    b = math.sin(start_lat) * math.sin(end_lat) + math.cos(start_lat) * math.cos(end_lat) * math.cos(delta_lon)
    angular_distance = math.atan2(math.sqrt(a), b)

    # Generate points along the great circle
    intermediate_points = []
    for i in range(num_points + 1):  # Include start and end points
        fraction = i / num_points
        A = math.sin((1 - fraction) * angular_distance) / math.sin(angular_distance)
        B = math.sin(fraction * angular_distance) / math.sin(angular_distance)
        
        x = A * math.cos(start_lat) * math.cos(start_lon) + B * math.cos(end_lat) * math.cos(end_lon)
        y = A * math.cos(start_lat) * math.sin(start_lon) + B * math.cos(end_lat) * math.sin(end_lon)
        z = A * math.sin(start_lat) + B * math.sin(end_lat)
        
        intermediate_lat = math.atan2(z, math.sqrt(x ** 2 + y ** 2))
        intermediate_lon = math.atan2(y, x)
        
        # Convert radians back to degrees
        intermediate_points.append((math.degrees(intermediate_lat), math.degrees(intermediate_lon)))
    
    return intermediate_points


if __name__ == "__main__":
    # Example inputs
    start_latitude = 1.784303195436289  # Chennai latitude
    start_longitude = 88.494873046875  # Chennai longitude
    end_latitude = -2.0018508912102275  # Perth latitude
    end_longitude = 90.74707031250001  # Perth longitude
    
    # Generate intermediate points
    points = generate_intermediate_coordinates(
        start_lat=start_latitude,
        start_lon=start_longitude,
        end_lat=end_latitude,
        end_lon=end_longitude,
        num_points=10
    )
    
    # Print the points
    print("Intermediate coordinates:")
    for idx, point in enumerate(points):
        print(f"Point {idx + 1}: Latitude = {point[0]}, Longitude = {point[1]}")
