import requests
from bs4 import BeautifulSoup

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
}

url = "https://en.wikipedia.org/wiki/Tha_Block_Is_Hot"
data = []

try:
    # Send a GET request to the URL
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes

    # Create a BeautifulSoup object to parse the HTML content
    soup = BeautifulSoup(response.content, "html.parser")

    # Find the first div with class "track-listing"
    track_listing_div = soup.find("div", class_="track-listing")

    if track_listing_div:
        # Find all the <tr> elements within the "track-listing" div
        tr_elements = track_listing_div.find_all("tr")

        if tr_elements:
            for i in range(1, len(tr_elements)-1):
            # Extract information from the <tr> element and print as a tuple
              tr = tr_elements[i]
              track_number = tr.find("th").get_text(strip=True).rstrip(".")
              track_title = tr.find("td").get_text(strip=True)
              artist = tr.find("td").find_next_sibling("td").get_text(strip=True)
              track_length = tr.find("td", class_="tracklist-length").get_text(strip=True)

              track_info = [track_number, track_title, artist, track_length]
              data.append(track_info)
              print(track_info)
        else:
            print("No <tr> elements found within the 'track-listing' div.")
    else:
        print("No 'track-listing' div found.")

except requests.exceptions.RequestException as e:
    print("An error occurred while making the request:", e)
