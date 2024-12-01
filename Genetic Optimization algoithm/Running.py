import subprocess

# Define the sequence of scripts to run
sequence = ["optimization.py", "global.py"]

for script in sequence:
    print(f"Running {script}...")
    result = subprocess.run(["python", script])
    if result.returncode != 0:
        print(f"Error occurred while running {script}. Exiting...")
        break
