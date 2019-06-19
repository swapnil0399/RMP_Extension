from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException
import sys, logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def getData(univ, prof):

    try:

        url = "https://www.ratemyprofessors.com"

        chromeOptions = Options()  
        chromeOptions.add_argument("--headless")

        driver = webdriver.Chrome(executable_path='/usr/bin/chromedriver', chrome_options=chromeOptions)
        driver.implicitly_wait(30)

        driver.get(url)

        driver.find_element_by_xpath("//div[@id = 'cookie_notice']/a[@class = 'btn close-this']").click()
        driver.find_element_by_xpath("//a[@id = 'findProfessorOption']/span[@class = 'v-align info']").click()

        school_name = driver.find_element_by_id('searchProfessorSchool2')
        school_name.send_keys(univ)

        prof_bar = driver.find_element_by_id('searchProfessorName')
        prof_bar.send_keys(prof)

        submit = driver.find_element_by_id('prof-name-btn')
        submit.submit()

        try: 
            results = driver.find_element_by_xpath("//*[@id='searchResultsBox']/div[2]/ul/li/a/span[2]/span[1]")
            results.click()
            quality = driver.find_element_by_xpath("//*[@id='mainContent']/div[1]/div[3]/div[1]/div/div[1]/div/div/div").text
            level_of_diff = driver.find_element_by_xpath("//*[@id='mainContent']/div[1]/div[3]/div[1]/div/div[2]/div[2]/div").text
            rating_url = driver.current_url

            return {    
                "University" : univ, 
                "Professor_Name" : prof, 
                "Quality" : quality, 
                "Level_Of_Diff" : level_of_diff, 
                "URL" : rating_url
            }    

        except Exception as exp:
            print('ERROR: ' , str(exp))
            return None

        finally:
            driver.close()

    except Exception as exp:
        logger.error('ERORR: ' + str(exp))

# print(sys.argv[1], sys.argv[2])
print(getData(sys.argv[1], sys.argv[2]))
