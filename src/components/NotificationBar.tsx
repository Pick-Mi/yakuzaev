import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const NotificationBar = () => {
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationCtaText, setNotificationCtaText] = useState("Book Now");
  const [notificationCtaUrl, setNotificationCtaUrl] = useState("/products");
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const fetchNotification = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("header_notification, notification_enabled, notification_cta_text, notification_cta_url")
        .single();

      if (data && !error) {
        setNotificationMessage(data.header_notification || "");
        setIsEnabled(data.notification_enabled || false);
        if (data.notification_cta_text) setNotificationCtaText(data.notification_cta_text);
        if (data.notification_cta_url) setNotificationCtaUrl(data.notification_cta_url);
      }
    };

    fetchNotification();
  }, []);

  if (!isEnabled || !notificationMessage) return null;

  return (
    <div className="w-full bg-[#0C121C] text-white h-10 sm:h-12 p-[15px] flex items-center">
      <div className="container mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <span className="text-[10px] sm:text-xs md:text-sm text-center">{notificationMessage}</span>
        <Link 
          to={notificationCtaUrl} 
          className="font-medium hover:underline underline-offset-4 transition-all text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
        >
          {notificationCtaText}
        </Link>
      </div>
    </div>
  );
};

export default NotificationBar;
