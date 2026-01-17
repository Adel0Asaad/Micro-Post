import { Locale } from './config';

const translations = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      feed: 'Feed',
      following: 'Following',
      users: 'Users',
      myPosts: 'My Posts',
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
    },

    // Common actions
    common: {
      submit: 'Submit',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      save: 'Save',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      search: 'Search',
      close: 'Close',
      viewAll: 'View All',
      seeMore: 'See More',
      seeLess: 'See Less',
    },

    // Home page
    home: {
      welcome: 'Welcome to MicroPost',
      tagline:
        "Share your thoughts with the world in 280 characters or less. Connect with others and see what they're thinking.",
      getStarted: 'Get Started',
      signIn: 'Sign In',
      features: {
        create: {
          title: 'Create Posts',
          description: 'Share your thoughts, ideas, and updates with others.',
        },
        connect: {
          title: 'Connect',
          description: 'Follow and interact with other users in the community.',
        },
        discover: {
          title: 'Discover',
          description: 'Explore trending topics and discover new perspectives.',
        },
      },
    },

    // Auth
    auth: {
      login: {
        title: 'Login to MicroPost',
        email: 'Email',
        emailPlaceholder: 'you@example.com',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        submit: 'Login',
        noAccount: "Don't have an account?",
        registerLink: 'Register here',
        error: {
          invalid: 'Invalid email or password',
          required: 'Please enter both email and password',
        },
      },
      register: {
        title: 'Create an Account',
        name: 'Name',
        namePlaceholder: 'John Doe',
        email: 'Email',
        emailPlaceholder: 'you@example.com',
        password: 'Password',
        passwordPlaceholder: '••••••••',
        passwordHelper: 'Minimum 6 characters',
        confirmPassword: 'Confirm Password',
        submit: 'Create Account',
        hasAccount: 'Already have an account?',
        loginLink: 'Login here',
        error: {
          required: 'Please fill in all fields',
          passwordMismatch: 'Passwords do not match',
          passwordLength: 'Password must be at least 6 characters',
        },
      },
    },

    // Posts
    posts: {
      create: {
        placeholder: "What's on your mind?",
        submit: 'Post',
        error: {
          empty: 'Please write something to post',
          failed: 'Failed to create post',
        },
        success: 'Post created successfully!',
      },
      delete: {
        button: 'Delete',
        deleting: 'Deleting...',
        error: 'Failed to delete post',
      },
      edit: {
        button: 'Edit',
        submit: 'Save',
        error: 'Failed to update post',
      },
      translation: {
        label: 'Translate:',
        original: 'Original',
      },
      like: 'Like',
      unlike: 'Unlike',
      reply: {
        button: 'Reply',
        placeholder: 'Write a reply...',
        submit: 'Reply',
        error: 'Failed to post reply',
        view: 'View {count} replies',
        hide: 'Hide replies',
      },
      empty: 'No posts yet. Be the first to share something!',
      myPostsEmpty:
        "You haven't posted anything yet. Share your first thought!",
    },

    // Feed page
    feed: {
      title: 'Feed',
      subtitle: 'See what everyone is posting',
      error: 'Failed to load feed',
    },

    // Following Feed page
    followingFeed: {
      title: 'Following',
      subtitle: 'Posts from people you follow',
      error: 'Failed to load feed',
      empty:
        'No posts from people you follow yet. Start following users to see their posts here!',
    },

    // My Posts page
    myPosts: {
      title: 'My Posts',
      subtitle: 'Manage your posts',
      error: 'Failed to load posts',
    },

    // Users page
    users: {
      title: 'Users',
      subtitle: 'View all users in the system',
      viewPosts: 'View Posts',
      joined: 'Joined',
      follow: 'Follow',
      unfollow: 'Unfollow',
      followers: 'followers',
      following: 'following',
      postsCount: 'posts',
      error: 'Failed to load users',
      posts: {
        title: "{name}'s Posts",
        subtitle: 'View all posts by {name}',
        empty: "{name} hasn't posted anything yet.",
      },
    },

    // Theme
    theme: {
      toggle: 'Toggle theme',
      light: 'Light mode',
      dark: 'Dark mode',
      system: 'System preference',
    },

    // Language
    language: {
      toggle: 'Switch language',
      en: 'English',
      ar: 'العربية',
    },

    // Errors
    errors: {
      notFound: 'Page not found',
      unauthorized: 'You must be logged in to view this page',
      serverError: 'Something went wrong. Please try again.',
    },
  },

  ar: {
    // Navigation
    nav: {
      home: 'الرئيسية',
      feed: 'التغذية',
      following: 'المتابَعون',
      users: 'المستخدمون',
      myPosts: 'منشوراتي',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      register: 'إنشاء حساب',
    },

    // Common actions
    common: {
      submit: 'إرسال',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      save: 'حفظ',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجاح',
      confirm: 'تأكيد',
      back: 'رجوع',
      next: 'التالي',
      search: 'بحث',
      close: 'إغلاق',
      viewAll: 'عرض الكل',
      seeMore: 'عرض المزيد',
      seeLess: 'عرض أقل',
    },

    // Home page
    home: {
      welcome: 'مرحباً بك في MicroPost',
      tagline:
        'شارك أفكارك مع العالم في 280 حرفاً أو أقل. تواصل مع الآخرين واكتشف ما يفكرون فيه.',
      getStarted: 'ابدأ الآن',
      signIn: 'تسجيل الدخول',
      features: {
        create: {
          title: 'إنشاء منشورات',
          description: 'شارك أفكارك ومستجداتك مع الآخرين.',
        },
        connect: {
          title: 'تواصل',
          description: 'تابع وتفاعل مع المستخدمين الآخرين في المجتمع.',
        },
        discover: {
          title: 'اكتشف',
          description: 'استكشف المواضيع الرائجة واكتشف وجهات نظر جديدة.',
        },
      },
    },

    // Auth
    auth: {
      login: {
        title: 'تسجيل الدخول إلى MicroPost',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'you@example.com',
        password: 'كلمة المرور',
        passwordPlaceholder: '••••••••',
        submit: 'تسجيل الدخول',
        noAccount: 'ليس لديك حساب؟',
        registerLink: 'سجل هنا',
        error: {
          invalid: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
          required: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور',
        },
      },
      register: {
        title: 'إنشاء حساب جديد',
        name: 'الاسم',
        namePlaceholder: 'محمد أحمد',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'you@example.com',
        password: 'كلمة المرور',
        passwordPlaceholder: '••••••••',
        passwordHelper: '6 أحرف على الأقل',
        confirmPassword: 'تأكيد كلمة المرور',
        submit: 'إنشاء الحساب',
        hasAccount: 'لديك حساب بالفعل؟',
        loginLink: 'سجل دخولك هنا',
        error: {
          required: 'الرجاء ملء جميع الحقول',
          passwordMismatch: 'كلمات المرور غير متطابقة',
          passwordLength: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        },
      },
    },

    // Posts
    posts: {
      create: {
        placeholder: 'بماذا تفكر؟',
        submit: 'نشر',
        error: {
          empty: 'الرجاء كتابة شيء للنشر',
          failed: 'فشل في إنشاء المنشور',
        },
        success: 'تم إنشاء المنشور بنجاح!',
      },
      delete: {
        button: 'حذف',
        deleting: 'جاري الحذف...',
        error: 'فشل في حذف المنشور',
      },
      edit: {
        button: 'تعديل',
        submit: 'حفظ',
        error: 'فشل في تحديث المنشور',
      },
      translation: {
        label: 'ترجمة:',
        original: 'الأصلي',
      },
      like: 'إعجاب',
      unlike: 'إلغاء الإعجاب',
      reply: {
        button: 'رد',
        placeholder: 'اكتب رداً...',
        submit: 'رد',
        error: 'فشل في نشر الرد',
        view: 'عرض {count} ردود',
        hide: 'إخفاء الردود',
      },
      empty: 'لا توجد منشورات بعد. كن أول من يشارك شيئاً!',
      myPostsEmpty: 'لم تنشر أي شيء بعد. شارك فكرتك الأولى!',
    },

    // Feed page
    feed: {
      title: 'التغذية',
      subtitle: 'شاهد ما ينشره الجميع',
      error: 'فشل في تحميل التغذية',
    },

    // Following Feed page
    followingFeed: {
      title: 'المتابَعون',
      subtitle: 'منشورات الأشخاص الذين تتابعهم',
      error: 'فشل في تحميل التغذية',
      empty:
        'لا توجد منشورات من الأشخاص الذين تتابعهم بعد. ابدأ بمتابعة المستخدمين لرؤية منشوراتهم هنا!',
    },

    // My Posts page
    myPosts: {
      title: 'منشوراتي',
      subtitle: 'إدارة منشوراتك',
      error: 'فشل في تحميل المنشورات',
    },

    // Users page
    users: {
      title: 'المستخدمون',
      subtitle: 'عرض جميع المستخدمين في النظام',
      viewPosts: 'عرض المنشورات',
      joined: 'انضم في',
      follow: 'متابعة',
      unfollow: 'إلغاء المتابعة',
      followers: 'متابعون',
      following: 'يتابع',
      postsCount: 'منشورات',
      error: 'فشل في تحميل المستخدمين',
      posts: {
        title: 'منشورات {name}',
        subtitle: 'عرض جميع منشورات {name}',
        empty: 'لم ينشر {name} أي شيء بعد.',
      },
    },

    // Theme
    theme: {
      toggle: 'تغيير المظهر',
      light: 'الوضع الفاتح',
      dark: 'الوضع الداكن',
      system: 'تفضيل النظام',
    },

    // Language
    language: {
      toggle: 'تغيير اللغة',
      en: 'English',
      ar: 'العربية',
    },

    // Errors
    errors: {
      notFound: 'الصفحة غير موجودة',
      unauthorized: 'يجب تسجيل الدخول لعرض هذه الصفحة',
      serverError: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    },
  },
} as const;

// Deep type that maps any readonly translation structure to mutable string values
type DeepString<T> = T extends string
  ? string
  : T extends object
    ? { [K in keyof T]: DeepString<T[K]> }
    : T;

export type TranslationKeys = DeepString<typeof translations.en>;

export function getTranslations(locale: Locale): TranslationKeys {
  const t = translations[locale as keyof typeof translations];
  return (t || translations.en) as TranslationKeys;
}

// Helper function to get a nested translation value
export function t(
  translations: TranslationKeys,
  path: string,
  params?: Record<string, string>,
): string {
  const keys = path.split('.');
  let value: unknown = translations;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path; // Return path as fallback
    }
  }

  if (typeof value !== 'string') {
    return path;
  }

  // Replace parameters like {name}
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, key) => params[key] || `{${key}}`);
  }

  return value;
}

export default translations;
