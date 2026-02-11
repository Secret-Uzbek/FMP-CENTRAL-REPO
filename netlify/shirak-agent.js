// netlify/functions/shirat-agent.js

exports.handler = async function(event, context) {
  // 1. Разрешаем запросы с любого сайта (CORS), чтобы ваш фронтенд мог обращаться к функции
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Ответ на предварительные запросы браузера
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // 2. Основная логика агента
    console.log('🤖 SHIRAK Agent запущен...');
    
    // Получаем токен из переменных окружения Netlify
    const GH_TOKEN = process.env.GH_TOKEN;
    
    if (!GH_TOKEN) {
      throw new Error('Токен GH_TOKEN не найден в настройках Netlify.');
    }

    // 3. Пример задачи: Проверить релизы navoiy-terra-corpus
    const apiUrl = 'https://api.github.com/repos/Secret-Uzbek/navoiy-terra-corpus/releases';
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `token ${GH_TOKEN}`,
        'User-Agent': 'SHIRAK-Netlify-Agent'
      }
    });

    const releases = await response.json();
    const latestRelease = releases.length > 0 ? releases[0].tag_name : 'Релизов нет';

    // 4. Формируем успешный ответ
    const result = {
      success: true,
      message: 'Агент SHIRAK выполнил задачу.',
      data: {
        task: 'Проверка последнего релиза корпуса',
        repository: 'Secret-Uzbek/navoiy-terra-corpus',
        latestRelease: latestRelease,
        releaseCount: releases.length,
        timestamp: new Date().toISOString(),
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };

  } catch (error) {
    // 5. Формируем ответ в случае ошибки
    console.error('❌ Ошибка в функции SHIRAK:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
        tip: 'Проверьте GH_TOKEN в Environment Variables Netlify.'
      }),
    };
  }
};
