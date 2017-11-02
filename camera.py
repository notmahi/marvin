from pygame import camera
from pygame import image as pyimage

camera.init()

list_of_cameras = camera.list_cameras()
print("Found {} cameras!".format(len(list_of_cameras)))

my_camera = camera.Camera(list_of_cameras[0])
print("Successfully connected to the camera!")

my_camera.start()
surface = my_camera.get_image()
print(surface)
pyimage.save(surface, 'test.bmp')
my_camera.stop()
