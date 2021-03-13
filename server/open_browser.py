from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

from time import sleep

def seconds_to_hms(seconds):
    if seconds < 0:
        return "-"
                
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)

    if h > 0:
        return "%d:%02d:%02d" % (h, m, s)
    elif m > 0 and m < 10:
        return "%01d:%02d" % (m, s)
    elif m > 0:
        return "%02d:%02d" % (m, s)
    elif s > 0 and s < 90:
        return ":%02d" % (s,)
    else:
        return "%i" % (s,)

def main():
    # download the chrome driver from https://sites.google.com/a/chromium.org/chromedriver/downloads and put it in the
    # current directory
    chrome_driver = ".\\chromedriver.exe"

    driver = webdriver.Chrome(executable_path=chrome_driver)

    driver.get("http://127.0.0.1:5000/")

    driver.maximize_window()

    fs_button = driver.find_element_by_id("fullscreen-button")
    fs_button.click()

    for seconds_remaining in range(25*60,0,-1):
        print(f"\r{seconds_to_hms(seconds_remaining)}         ", end='')
        sleep(1)

    driver.execute_script("""socket.emit("recorder directive", {directive:"shutdown"}); return 0;""")
    driver.quit()

if __name__ == '__main__':
    main()