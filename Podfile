# Resolve react_native_pods.rb with node to allow for hoisting
require Pod::Executable.execute_command('node', ['-p', <<~'NODE_SCRIPT', __dir__]).strip
  require.resolve(
    "react-native/scripts/react_native_pods.rb",
    {paths: [process.argv[1]]},
  )
NODE_SCRIPT

platform :ios, min_ios_version_supported
prepare_react_native_project!

linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

target 'HealthEnrollmentApp' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  target 'HealthEnrollmentAppTests' do
    inherit! :complete
    # Pods for testing
  end
end

post_install do |installer|
  # https://github.com/facebook/react-native/blob/main/packages/react-native/scripts/react_native_pods.rb#L197-L202
  react_native_post_install(
    installer,
    config[:reactNativePath],
    :mac_catalyst_enabled => false,
    # :ccache_enabled => true
  )
end
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'KikiKickzLab' do
  # Comment the next line if you don't want to use dynamic frameworks
  use_frameworks!

  # Pods for KikiKickzLab
  pod 'SwiftyJSON'

end