require 'rubygems'
require 'rmagick'
require 'fileutils'

CURRENT_PATH = Dir.pwd
PATH         = "#{CURRENT_PATH}/images/*.jpg"

#clean up previously generated thumbs
FileUtils.rm_rf('images/thumbs')
Dir.mkdir('images/thumbs')

Dir.glob(PATH) do |image_name|
  image = Magick::Image::read(image_name)[0]
  file_name = image_name.split("/").last
  thumb_name = "#{CURRENT_PATH}/images/thumbs/#{file_name.split('.').first}_thumb.jpg"
  image.resize_to_fit(4000, 140).write(thumb_name)
end