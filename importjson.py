import json
import re
from collections import defaultdict

def transform_data(data, id_value):
    # Split the name into prefix, main name, and suffix
    name_parts = data['name'].split('_')
    prefix = name_parts[0] if len(name_parts) > 1 else 'unknown'
    new_name = name_parts[1] if len(name_parts) > 1 else name_parts[0]

    # Simplify the image path
    new_img = re.sub(r'.*\\', '', data['img'])

    # Return the transformed data with the prefix and id
    transformed_data = {
        'name': new_name,
        'cooldown': data['cooldown'],
        'img': new_img,
        'id': id_value
    }

    return prefix.lower(), transformed_data

def process_file(file_path):
    # Load the data from the JSON file
    with open(file_path, 'r') as file:
        data_list = json.load(file)

    # Create a dictionary to hold arrays for each prefix
    categorized_data = defaultdict(list)

    # Transform the data and increment the id
    for i, data in enumerate(data_list):
        prefix, transformed_data = transform_data(data, i)
        categorized_data[prefix].append(transformed_data)

    return categorized_data

def save_to_file(data, file_path):
    # Save the transformed data back to a JSON file
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

# Example usage
input_file = 'mongoAbilities.json'
output_file = 'categorizedAbilities.json'

categorized_data = process_file(input_file)
save_to_file(categorized_data, output_file)

print(f"Categorized data saved to {output_file}")
