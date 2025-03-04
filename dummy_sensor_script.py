import time
import requests
import random

# **Global Variables**
ad_queue = []  # ✅ Store ads to prevent immediate repeats
played_ads = set()  # ✅ Track played ads
last_ad = None  # ✅ Store the last played ad

# **Function to fetch ads based on conditions**
def get_ad_url(category):
    try:
        response = requests.get(f"http://localhost:3000/getAd?category={category}")
        if response.status_code == 200 and "cloudinary.com" in response.text:
            return response.text.strip()
        else:
            print(f"⚠️ No valid ads found for {category}")
            return None
    except requests.RequestException as e:
        print(f"❌ Error fetching ad: {e}")
        return None

# **Function to update sensor data and play ads**
def update_sensor_data():
    global last_ad, ad_queue, played_ads

    # **Generate dummy sensor data**
    temperature = random.randint(15, 40)
    humidity = random.randint(10, 90)
    noise_level = random.randint(0, 100)
    motion_detected = random.choice([0, 1])  # 50% chance of motion detected

    print(f"\n📊 Sensor Data → Temp: {temperature}°C, Humidity: {humidity}%, Noise: {noise_level} dB, Motion: {motion_detected}")

    if motion_detected:
        print("✅ Motion detected! Selecting ad...")

        # **Determine ad category based on temperature**
        if temperature > 30:
            ad_category = "hot-ads"
        elif temperature < 20:
            ad_category = "cold-ads"
        else:
            ad_category = "random-ads"

        # **Mute if noise is greater than 60 dB**
        mute = noise_level > 60
        mute_status = "🔇 Muted" if mute else "🔊 With Sound"

        # **Ensure a fresh ad is selected**
        if not ad_queue:
            ad_url = get_ad_url(ad_category)

            if ad_url and ad_url != last_ad and ad_url not in played_ads:
                ad_queue.append((ad_url, mute))  # ✅ Store new ad
                played_ads.add(ad_url)

        # **Play the next ad in queue**
        if ad_queue:
            ad_url, mute = ad_queue.pop(0)
            last_ad = ad_url  # ✅ Track last played ad
            print(f"▶️ Playing: {ad_url} ({mute_status})")

            # **Simulate ad playback duration**
            ad_duration = random.randint(15, 30)  # ✅ Ad length: 15-30 sec
            time.sleep(ad_duration)

            # **Reset played ads when all are used**
            if len(played_ads) >= 5:  # Change number based on total ads in Cloudinary
                played_ads.clear()

            # **After the ad finishes, change sensor data**
            update_sensor_data()

    else:
        print("⏹ No motion detected. Screen off.")
        time.sleep(5)  # ✅ Shorter wait time when no motion detected

# **Run continuously**
while True:
    update_sensor_data()
