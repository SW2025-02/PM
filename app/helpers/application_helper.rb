module ApplicationHelper
  def format_duration(seconds)
    seconds = seconds.to_i

    return "0秒" if seconds == 0

    h = seconds / 3600
    m = (seconds % 3600) / 60
    s = seconds % 60

    parts = []
    parts << "#{h}時間" if h > 0
    parts << "#{m}分" if m > 0
    parts << "#{s}秒" if s > 0

    parts.join
  end
end
