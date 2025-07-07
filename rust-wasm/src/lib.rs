use wasm_bindgen::prelude::*;

// Import the `console.log` function from the Web API
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Define a macro for easier console logging
macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => {
            let mut a = 0u64;
            let mut b = 1u64;
            for _ in 2..=n {
                let temp = a + b;
                a = b;
                b = temp;
            }
            b
        }
    }
}

#[wasm_bindgen]
pub fn fibonacci_recursive(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2),
    }
}

#[wasm_bindgen]
pub fn bubble_sort(mut arr: Vec<i32>) -> Vec<i32> {
    let len = arr.len();
    for i in 0..len {
        for j in 0..len - 1 - i {
            if arr[j] > arr[j + 1] {
                arr.swap(j, j + 1);
            }
        }
    }
    arr
}

#[wasm_bindgen]
pub fn quick_sort(mut arr: Vec<i32>) -> Vec<i32> {
    let len = arr.len() as i32;
    quick_sort_helper(&mut arr, 0, len - 1);
    arr
}

fn quick_sort_helper(arr: &mut [i32], low: i32, high: i32) {
    if low < high {
        let pi = partition(arr, low, high);
        quick_sort_helper(arr, low, pi - 1);
        quick_sort_helper(arr, pi + 1, high);
    }
}

fn partition(arr: &mut [i32], low: i32, high: i32) -> i32 {
    let pivot = arr[high as usize];
    let mut i = low - 1;
    
    for j in low..high {
        if arr[j as usize] <= pivot {
            i += 1;
            arr.swap(i as usize, j as usize);
        }
    }
    arr.swap((i + 1) as usize, high as usize);
    i + 1
}

#[wasm_bindgen]
pub fn matrix_multiply(a: Vec<f64>, b: Vec<f64>, size: usize) -> Vec<f64> {
    let mut result = vec![0.0; size * size];
    
    for i in 0..size {
        for j in 0..size {
            for k in 0..size {
                result[i * size + j] += a[i * size + k] * b[k * size + j];
            }
        }
    }
    
    result
}

#[wasm_bindgen]
pub fn image_blur(pixels: Vec<u8>, width: usize, height: usize) -> Vec<u8> {
    let mut result = vec![0u8; pixels.len()];
    
    for y in 1..height - 1 {
        for x in 1..width - 1 {
            for c in 0..4 { // RGBA channels
                let mut sum = 0u32;
                let mut count = 0u32;
                
                // 3x3 kernel blur
                for dy in -1i32..=1 {
                    for dx in -1i32..=1 {
                        let ny = (y as i32 + dy) as usize;
                        let nx = (x as i32 + dx) as usize;
                        let idx = (ny * width + nx) * 4 + c;
                        sum += pixels[idx] as u32;
                        count += 1;
                    }
                }
                
                let idx = (y * width + x) * 4 + c;
                result[idx] = (sum / count) as u8;
            }
        }
    }
    
    // Copy edges
    for y in 0..height {
        for x in 0..width {
            if y == 0 || y == height - 1 || x == 0 || x == width - 1 {
                for c in 0..4 {
                    let idx = (y * width + x) * 4 + c;
                    result[idx] = pixels[idx];
                }
            }
        }
    }
    
    result
}

#[wasm_bindgen]
pub fn prime_sieve(limit: u32) -> Vec<u32> {
    let mut sieve = vec![true; (limit + 1) as usize];
    sieve[0] = false;
    if limit > 0 {
        sieve[1] = false;
    }
    
    let mut p = 2;
    while p * p <= limit {
        if sieve[p as usize] {
            let mut i = p * p;
            while i <= limit {
                sieve[i as usize] = false;
                i += p;
            }
        }
        p += 1;
    }
    
    let mut primes = Vec::new();
    for i in 2..=limit {
        if sieve[i as usize] {
            primes.push(i);
        }
    }
    
    primes
}
